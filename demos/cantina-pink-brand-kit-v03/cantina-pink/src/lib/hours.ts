import businessData from '../data/business.json';

type Shift = [string, string];
interface DayHours { day: number; shifts: Shift[] }

export const business = businessData as unknown as typeof businessData & {
  hours: { week: DayHours[]; closedDates: string[]; timezone: string; verified: boolean };
};

// Argentina no usa horario de verano: UTC-3 fijo.
const TZ_OFFSET = '-03:00';
const TZ = business.hours.timezone;

const DAY_NAMES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const DAY_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
const pad = (n: number) => String(n).padStart(2, '0');
const fromMin = (min: number) => `${pad(Math.floor(min / 60) % 24)}:${pad(min % 60)}`;

/** Fecha y minutos del día en la zona horaria del local. */
export function localParts(date: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23', weekday: 'short',
    }).formatToParts(date).map((p) => [p.type, p.value]),
  );
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday);
  return {
    ymd: `${parts.year}-${parts.month}-${parts.day}`,
    weekday,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

const shiftsFor = (weekday: number): Shift[] =>
  business.hours.week.find((d) => d.day === weekday)?.shifts ?? [];

export function shiftLabel([a, b]: Shift): string {
  return `${a.replace(':00', '')} a ${b === '24:00' ? '00' : b.replace(':00', '')} h`;
}

/** Agrupa días con el mismo horario: "Todos los días", "Lun a Vie", etc. */
export function hoursTable(): { days: string; shifts: string[] }[] {
  const week = [1, 2, 3, 4, 5, 6, 0];
  const groups: { days: number[]; key: string; shifts: Shift[] }[] = [];
  for (const d of week) {
    const shifts = shiftsFor(d);
    const key = JSON.stringify(shifts);
    const last = groups.at(-1);
    if (last && last.key === key) last.days.push(d);
    else groups.push({ days: [d], key, shifts });
  }
  return groups.map((g) => ({
    days:
      g.days.length === 7 ? 'Todos los días'
      : g.days.length === 1 ? DAY_SHORT[g.days[0]]
      : `${DAY_SHORT[g.days[0]]} a ${DAY_SHORT[g.days.at(-1)!]}`,
    shifts: g.shifts.length ? g.shifts.map(shiftLabel) : ['Cerrado'],
  }));
}

export function openStatus(now = new Date()): { open: boolean; label: string } {
  const { weekday, minutes } = localParts(now);
  const current = shiftsFor(weekday).find(([a, b]) => minutes >= toMin(a) && minutes < toMin(b));
  if (current) return { open: true, label: `Abierto hasta las ${current[1] === '24:00' ? '00' : current[1]} h` };
  for (let i = 0; i < 7; i++) {
    const wd = (weekday + i) % 7;
    const next = shiftsFor(wd).find(([a]) => i > 0 || toMin(a) > minutes);
    if (next) {
      const when = i === 0 ? 'hoy' : i === 1 ? 'mañana' : `el ${DAY_NAMES[wd]}`;
      return { open: false, label: `Cerrado · abre ${when} a las ${next[0]} h` };
    }
  }
  return { open: false, label: 'Cerrado' };
}

export interface PickupDay { ymd: string; label: string; slots: { value: string; label: string }[] }

/** Turnos de retiro disponibles: dentro del horario, con tiempo de preparación y sin turnos pasados. */
export function pickupDays(now = new Date(), leadOverride?: number): PickupDay[] {
  const { slotMinutes, leadMinutes: pickupLead, daysAhead, lastSlotBeforeCloseMinutes } = business.pickup;
  const leadMinutes = leadOverride ?? pickupLead;
  const earliest = now.getTime() + leadMinutes * 60_000;
  const days: PickupDay[] = [];

  for (let i = 0; i <= daysAhead; i++) {
    const ref = new Date(now.getTime() + i * 86_400_000);
    const { ymd, weekday } = localParts(ref);
    if (business.hours.closedDates.includes(ymd)) continue;
    const slots: PickupDay['slots'] = [];
    for (const [a, b] of shiftsFor(weekday)) {
      for (let m = toMin(a); m <= toMin(b) - lastSlotBeforeCloseMinutes; m += slotMinutes) {
        // turnos después de medianoche caen el día siguiente; se omiten por simplicidad
        if (m >= 1440) continue;
        const value = `${ymd}T${fromMin(m)}:00${TZ_OFFSET}`;
        if (new Date(value).getTime() < earliest) continue;
        slots.push({ value, label: fromMin(m) });
      }
    }
    if (!slots.length) continue;
    const [, mo, d] = ymd.split('-');
    const name = i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : DAY_NAMES[weekday][0].toUpperCase() + DAY_NAMES[weekday].slice(1);
    days.push({ ymd, label: `${name} ${Number(d)}/${Number(mo)}`, slots });
  }
  return days;
}

export function isValidPickup(value: string, now = new Date(), leadOverride?: number): boolean {
  return pickupDays(now, leadOverride).some((d) => d.slots.some((s) => s.value === value));
}

/** "Lo antes posible" solo tiene sentido si el local está abierto y falta tiempo para el cierre. */
export function canAsap(now = new Date()): boolean {
  const { weekday, minutes } = localParts(now);
  const shift = shiftsFor(weekday).find(([a, b]) => minutes >= toMin(a) && minutes < toMin(b));
  return !!shift && toMin(shift[1]) - minutes >= business.pickup.lastSlotBeforeCloseMinutes + 15;
}

export function formatPickup(value: string): string {
  const date = new Date(value);
  const { weekday, minutes } = localParts(date);
  const day = new Intl.DateTimeFormat('es-AR', { timeZone: TZ, day: 'numeric', month: 'numeric' }).format(date);
  return `${DAY_NAMES[weekday]} ${day} a las ${fromMin(minutes)} h`;
}

/** openingHoursSpecification para schema.org */
export function openingHoursSchema() {
  const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return business.hours.week.flatMap((d) =>
    d.shifts.map(([opens, closes]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: names[d.day],
      opens,
      closes: closes === '24:00' ? '23:59' : closes,
    })),
  );
}
