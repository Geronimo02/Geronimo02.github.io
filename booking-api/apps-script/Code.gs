// Deploy this as a web app that runs as the calendar owner. Set the script
// properties BOOKING_SECRET, OWNER_EMAIL, and CALENDAR_ID before deployment.
const BOOKING = {
  timeZone: 'America/Argentina/Buenos_Aires',
  durationMinutes: 60,
  leadMinutes: 60,
  daysAhead: 60,
  hoursByWeekday: {
    1: [9, 10, 11, 13, 14, 15, 16, 17],
    2: [9, 10, 11, 13, 14, 15, 16, 17],
    3: [9, 10, 11, 13, 14, 15, 16, 17],
    4: [9, 10, 11, 13, 14, 15, 16, 17],
    5: [9, 10, 11, 13, 14, 15, 16, 17]
  }
};

function doPost(e) {
  try {
    const input = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const properties = PropertiesService.getScriptProperties();
    const expected = properties.getProperty('BOOKING_SECRET');
    if (!expected || !sameSecret_(String(input.secret || ''), expected)) {
      return json_({ ok: false, status: 403, error: 'forbidden' });
    }

    const calendarId = properties.getProperty('CALENDAR_ID');
    const calendar = calendarId ? CalendarApp.getCalendarById(calendarId) : CalendarApp.getDefaultCalendar();
    if (!calendar) return json_({ ok: false, status: 503, error: 'calendar_unavailable' });

    if (input.action === 'availability') {
      return json_(availability_(calendar, String(input.month || '')));
    }
    if (input.action === 'book') {
      const ownerEmail = properties.getProperty('OWNER_EMAIL');
      if (!ownerEmail) return json_({ ok: false, status: 503, error: 'email_unconfigured' });
      return json_(book_(calendar, ownerEmail, input));
    }
    return json_({ ok: false, status: 400, error: 'unknown_action' });
  } catch (error) {
    console.error('Booking request failed', error);
    return json_({ ok: false, status: 500, error: 'booking_unavailable' });
  }
}

function availability_(calendar, month) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    return { ok: false, status: 400, error: 'invalid_month' };
  }
  const [year, monthNumber] = month.split('-').map(Number);
  const days = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  const now = new Date();
  const todayKey = Utilities.formatDate(now, BOOKING.timeZone, 'yyyy-MM-dd');
  const finalKey = addDays_(todayKey, BOOKING.daysAhead);
  const dates = {};

  for (let day = 1; day <= days; day++) {
    const dayKey = Utilities.formatDate(new Date(Date.UTC(year, monthNumber - 1, day)), 'UTC', 'yyyy-MM-dd');
    if (dayKey < todayKey || dayKey > finalKey) continue;
    const weekday = new Date(Date.UTC(year, monthNumber - 1, day)).getUTCDay();
    const hours = BOOKING.hoursByWeekday[weekday] || [];
    if (!hours.length) continue;
    const firstSlot = slot_(dayKey, hours[0]);
    const lastSlot = slot_(dayKey, hours[hours.length - 1]);
    const occupied = calendar.getEvents(firstSlot.start, lastSlot.end)
      .filter(event => event.getTransparency() !== CalendarApp.EventTransparency.TRANSPARENT);
    const slots = hours.map(hour => slot_(dayKey, hour))
      .filter(slot => slot.start.getTime() > now.getTime() + BOOKING.leadMinutes * 60000)
      .filter(slot => !occupied.some(event => overlaps_(event, slot.start, slot.end)))
      .map(slot => ({ time: slot.time, start: slot.start.toISOString() }));
    if (slots.length) dates[dayKey] = slots;
  }
  return { ok: true, month, timeZone: BOOKING.timeZone, durationMinutes: BOOKING.durationMinutes, dates };
}

function book_(calendar, ownerEmail, input) {
  const date = String(input.date || '');
  const time = String(input.time || '');
  const name = String(input.name || '').trim().slice(0, 100);
  const email = String(input.email || '').trim().toLowerCase();
  const message = String(input.message || '').trim().slice(0, 1000);
  if (!/^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01])$/.test(date)
    || !/^([01]\d|2[0-3]):00$/.test(time)
    || name.length < 2
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    || email.length > 254) {
    return { ok: false, status: 400, error: 'invalid_booking' };
  }
  if (Utilities.formatDate(new Date(date + 'T00:00:00Z'), 'UTC', 'yyyy-MM-dd') !== date) {
    return { ok: false, status: 400, error: 'invalid_booking' };
  }
  const weekday = new Date(date + 'T00:00:00Z').getUTCDay();
  if (!(BOOKING.hoursByWeekday[weekday] || []).includes(Number(time.slice(0, 2)))) {
    return { ok: false, status: 400, error: 'invalid_slot' };
  }

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return { ok: false, status: 503, error: 'try_again' };
  try {
    const now = new Date();
    const todayKey = Utilities.formatDate(now, BOOKING.timeZone, 'yyyy-MM-dd');
    if (date < todayKey || date > addDays_(todayKey, BOOKING.daysAhead)) {
      return { ok: false, status: 400, error: 'date_out_of_range' };
    }
    const slot = slot_(date, Number(time.slice(0, 2)));
    if (slot.start.getTime() <= now.getTime() + BOOKING.leadMinutes * 60000) {
      return { ok: false, status: 409, error: 'slot_unavailable' };
    }
    if (busy_(calendar, slot.start, slot.end)) {
      return { ok: false, status: 409, error: 'slot_unavailable' };
    }

    const event = Calendar.Events.insert({
      summary: 'Llamada de diagnóstico — ' + name,
      description: `Reserva desde el portfolio\nNombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
      start: { dateTime: slot.start.toISOString(), timeZone: BOOKING.timeZone },
      end: { dateTime: slot.end.toISOString(), timeZone: BOOKING.timeZone },
      attendees: [{ email }],
      conferenceData: {
        createRequest: {
          requestId: Utilities.getUuid(),
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      }
    }, calendar.getId(), { conferenceDataVersion: 1, sendUpdates: 'all' });

    let notificationSent = true;
    try {
      MailApp.sendEmail({
        to: ownerEmail,
        subject: `Nueva reserva de diagnóstico — ${name}`,
        body: `Nueva llamada de diagnóstico\n\nFecha: ${date}\nHora: ${time} (Buenos Aires)\nDuración: 60 minutos\nNombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message || '(sin mensaje)'}\n\nEvento: ${event.htmlLink || ''}`
      });
    } catch (error) {
      notificationSent = false;
      console.error('Booking created, but owner email failed', error);
    }

    return {
      ok: true,
      start: slot.start.toISOString(),
      end: slot.end.toISOString(),
      eventId: event.id,
      meetUrl: event.hangoutLink || null,
      notificationSent
    };
  } finally {
    lock.releaseLock();
  }
}

function slot_(date, hour) {
  const time = String(hour).padStart(2, '0') + ':00';
  const start = Utilities.parseDate(date + ' ' + time, BOOKING.timeZone, 'yyyy-MM-dd HH:mm');
  const end = new Date(start.getTime() + BOOKING.durationMinutes * 60000);
  return { time, start, end };
}

function busy_(calendar, start, end) {
  return calendar.getEvents(start, end).some(event =>
    event.getTransparency() !== CalendarApp.EventTransparency.TRANSPARENT && overlaps_(event, start, end)
  );
}

function overlaps_(event, start, end) {
  return event.getStartTime().getTime() < end.getTime()
    && event.getEndTime().getTime() > start.getTime();
}

function addDays_(date, days) {
  const result = new Date(date + 'T00:00:00Z');
  result.setUTCDate(result.getUTCDate() + days);
  return Utilities.formatDate(result, 'UTC', 'yyyy-MM-dd');
}

function sameSecret_(a, b) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
