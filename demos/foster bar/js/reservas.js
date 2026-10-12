(() => {
  const form = document.querySelector('#reservation-form');
  if (!form) return;
  const fields = {
    name: document.querySelector('#guest-name'),
    date: document.querySelector('#visit-date'),
    people: document.querySelector('#guest-count'),
    time: document.querySelector('#visit-time')
  };
  const errors = {
    name: document.querySelector('#name-error'),
    date: document.querySelector('#date-error'),
    people: document.querySelector('#people-error'),
    time: document.querySelector('#time-error')
  };
  const status = document.querySelector('#form-status');
  const result = document.querySelector('#request-result');
  const message = document.querySelector('#request-message');
  const copyButton = document.querySelector('#copy-request');
  const copyStatus = document.querySelector('#copy-status');

  const localToday = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };
  fields.date.min = localToday();

  const setError = (key, text) => {
    errors[key].textContent = text;
    fields[key].setAttribute('aria-invalid', String(Boolean(text)));
  };
  const isAllowedDay = value => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return false;
    const year = Number(match[1]), month = Number(match[2]), day = Number(match[3]);
    const parsed = new Date(Date.UTC(year, month - 1, day));
    if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) return false;
    return [2, 3].includes(parsed.getUTCDay());
  };
  const validate = () => {
    Object.keys(fields).forEach(key => setError(key, ''));
    status.textContent = '';
    let valid = true;
    const name = fields.name.value.trim();
    if (!name) { setError('name', 'Escribí tu nombre.'); valid = false; }
    const date = fields.date.value;
    if (!date) { setError('date', 'Elegí una fecha.'); valid = false; }
    else if (date < localToday()) { setError('date', 'La fecha debe ser de hoy en adelante.'); valid = false; }
    else if (!isAllowedDay(date)) { setError('date', 'Solo aceptamos solicitudes para martes y miércoles.'); valid = false; }
    const people = Number(fields.people.value);
    if (!Number.isInteger(people) || people < 1) { setError('people', 'Indicá una cantidad de personas válida.'); valid = false; }
    const time = fields.time.value;
    if (!time) { setError('time', 'Elegí un horario preferido.'); valid = false; }
    else if (time < '19:00') { setError('time', 'El horario debe ser desde las 19:00 h.'); valid = false; }
    if (!valid) {
      status.textContent = 'Revisá los campos señalados para preparar la solicitud.';
      form.querySelector('[aria-invalid="true"]')?.focus();
    }
    return valid;
  };

  Object.entries(fields).forEach(([key, field]) => field.addEventListener('input', () => {
    setError(key, '');
    status.textContent = '';
    result.hidden = true;
  }));
  fields.date.addEventListener('change', () => {
    if (fields.date.value && !isAllowedDay(fields.date.value)) {
      setError('date', 'Solo aceptamos solicitudes para martes y miércoles.');
    }
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!validate()) return;
    const [year, month, day] = fields.date.value.split('-').map(Number);
    const friendlyDate = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(year, month - 1, day)));
    message.value = `Hola, soy ${fields.name.value.trim()}. Quisiera consultar si hay una mesa para ${fields.people.value} ${Number(fields.people.value) === 1 ? 'persona' : 'personas'} el ${friendlyDate} a las ${fields.time.value} h en Foster Burger Bar. Sé que esta solicitud no confirma la reserva. ¡Gracias!`;
    result.hidden = false;
    copyStatus.textContent = '';
    result.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' });
    result.querySelector('h4')?.setAttribute('tabindex', '-1');
    result.querySelector('h4')?.focus({ preventScroll: true });
  });
  copyButton.addEventListener('click', async () => {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(message.value);
      else {
        message.focus(); message.select();
        if (!document.execCommand('copy')) throw new Error('copy unavailable');
      }
      copyStatus.textContent = 'Mensaje copiado. Pegalo en tu conversación de Instagram con @fosterburgerbar.';
    } catch {
      message.focus(); message.select();
      copyStatus.textContent = 'No se pudo copiar automáticamente. Seleccioná el texto y copialo manualmente.';
    }
  });
})();
