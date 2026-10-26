(() => {
  const widget = document.querySelector('[data-booking-mode="live"]');
  if (!widget) return;

  const api = widget.dataset.bookingApi;
  const daysEl = widget.querySelector('[data-calendar-days]');
  const slotsEl = widget.querySelector('[data-time-slots]');
  const monthTitle = widget.querySelector('[data-month-title]');
  const selectedDayEl = widget.querySelector('[data-selected-day]');
  const statusEl = widget.querySelector('[data-booking-status]');
  const main = widget.querySelector('.booking-main');
  const formWrap = widget.querySelector('[data-booking-form]');
  const success = widget.querySelector('[data-booking-success]');
  const form = formWrap.querySelector('form');
  const submit = form.querySelector('button[type="submit"]');

  const zone = 'America/Argentina/Buenos_Aires';
  const todayKey = new Intl.DateTimeFormat('en-CA', {
    timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date());
  const today = new Date(`${todayKey}T00:00:00Z`);
  const lastDay = new Date(today);
  lastDay.setUTCDate(lastDay.getUTCDate() + 60);
  let shownMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
  let selectedDate = '';
  let selectedTime = '';
  let dates = {};
  let requestNumber = 0;

  const key = date => date.toISOString().slice(0, 10);
  const dateFromKey = value => new Date(`${value}T00:00:00Z`);
  const monthKey = date => date.toISOString().slice(0, 7);
  const format = (date, options) => new Intl.DateTimeFormat('es-AR', {
    timeZone: 'UTC', ...options
  }).format(date);
  const capital = value => value.charAt(0).toLocaleUpperCase('es-AR') + value.slice(1);

  function setStatus(message, kind = '') {
    statusEl.textContent = message;
    statusEl.dataset.kind = kind;
    statusEl.hidden = !message;
  }

  async function loadMonth() {
    const current = ++requestNumber;
    dates = {};
    selectedDate = '';
    setStatus('Buscando horarios disponibles…');
    render();
    try {
      const response = await fetch(`${api}/availability?month=${monthKey(shownMonth)}`);
      const result = await response.json();
      if (!response.ok || !result.ok || !result.dates) throw new Error('availability');
      if (current !== requestNumber) return;
      dates = result.dates;
      selectedDate = Object.keys(dates).sort()[0] || '';
      setStatus(selectedDate ? '' : 'No hay horarios disponibles este mes. Probá con el siguiente.');
      render();
    } catch {
      if (current !== requestNumber) return;
      setStatus('No pudimos cargar los horarios. Intentá de nuevo.', 'error');
      render();
    }
  }

  function render() {
    monthTitle.textContent = capital(format(shownMonth, { month: 'long', year: 'numeric' }));
    daysEl.replaceChildren();
    const firstWeekday = shownMonth.getUTCDay();
    const total = new Date(Date.UTC(shownMonth.getUTCFullYear(), shownMonth.getUTCMonth() + 1, 0)).getUTCDate();
    for (let i = 0; i < firstWeekday; i++) {
      const spacer = document.createElement('span');
      spacer.className = 'booking-day-spacer';
      daysEl.append(spacer);
    }
    for (let day = 1; day <= total; day++) {
      const date = new Date(Date.UTC(shownMonth.getUTCFullYear(), shownMonth.getUTCMonth(), day));
      const dateKey = key(date);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'booking-day';
      button.textContent = String(day);
      button.disabled = !dates[dateKey]?.length;
      button.setAttribute('aria-label', format(date, { weekday: 'long', day: 'numeric', month: 'long' }));
      if (dateKey === selectedDate) {
        button.classList.add('is-selected');
        button.setAttribute('aria-pressed', 'true');
      }
      button.addEventListener('click', () => {
        selectedDate = dateKey;
        render();
      });
      daysEl.append(button);
    }
    selectedDayEl.textContent = selectedDate
      ? capital(format(dateFromKey(selectedDate), { weekday: 'long', day: 'numeric', month: 'long' }))
      : 'Elegí un día disponible';
    slotsEl.replaceChildren();
    for (const slot of dates[selectedDate] || []) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'booking-slot';
      button.textContent = slot.time;
      button.setAttribute('aria-label', `${slot.time}, ${selectedDayEl.textContent}`);
      button.addEventListener('click', () => choose(slot.time));
      slotsEl.append(button);
    }
    widget.querySelector('[data-prev-month]').disabled = shownMonth.getTime() <= Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1);
    widget.querySelector('[data-next-month]').disabled = shownMonth.getTime() >= Date.UTC(lastDay.getUTCFullYear(), lastDay.getUTCMonth(), 1);
  }

  function choose(time) {
    selectedTime = time;
    widget.querySelector('[data-chosen-slot]').textContent =
      `${selectedDayEl.textContent} · ${time} (Buenos Aires)`;
    main.hidden = true;
    formWrap.hidden = false;
    setStatus('');
    form.querySelector('[name="name"]').focus();
  }

  function changeMonth(delta) {
    shownMonth = new Date(Date.UTC(shownMonth.getUTCFullYear(), shownMonth.getUTCMonth() + delta, 1));
    loadMonth();
  }

  widget.querySelector('[data-prev-month]').addEventListener('click', () => changeMonth(-1));
  widget.querySelector('[data-next-month]').addEventListener('click', () => changeMonth(1));
  widget.querySelector('[data-back-to-slots]').addEventListener('click', () => {
    formWrap.hidden = true;
    main.hidden = false;
    setStatus('');
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    submit.disabled = true;
    setStatus('Confirmando la reserva…');
    try {
      const data = Object.fromEntries(new FormData(form));
      data.turnstileToken = data['cf-turnstile-response'];
      delete data['cf-turnstile-response'];
      if (!data.turnstileToken) {
        setStatus('Completá la verificación antes de confirmar.', 'error');
        return;
      }
      const response = await fetch(`${api}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate, time: selectedTime, ...data }),
      });
      const result = await response.json();
      if (response.status === 409) {
        window.turnstile?.reset();
        formWrap.hidden = true;
        main.hidden = false;
        await loadMonth();
        setStatus('Ese horario acaba de ocuparse. Elegí otro.', 'error');
        return;
      }
      if (!response.ok || !result.ok) throw new Error('booking');
      formWrap.hidden = true;
      success.hidden = false;
      success.querySelector('[data-booking-success-time]').textContent =
        `${capital(format(dateFromKey(selectedDate), { weekday: 'long', day: 'numeric', month: 'long' }))} · ${selectedTime}`;
      setStatus('');
    } catch {
      setStatus('No pudimos confirmar la reserva. Intentá de nuevo.', 'error');
      window.turnstile?.reset();
    } finally {
      submit.disabled = false;
    }
  });

  if (api) loadMonth();
  else setStatus('La agenda todavía no está disponible.', 'error');
})();
