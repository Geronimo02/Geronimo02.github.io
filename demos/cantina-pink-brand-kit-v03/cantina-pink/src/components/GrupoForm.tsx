import { useEffect, useRef, useState } from 'preact/hooks';
import { business, slotsForDate, dayLabel, todayYmd, formatPickup } from '../lib/hours';
import { telUrl } from '../lib/contact';
import { load as loadCart } from '../lib/cart';
import { OCCASIONS, INTERESTS, buildGroupMessage, newConsultId, validateGroup, type GroupData } from '../lib/group';
import { waLink, MAX_WA_URL } from '../lib/order';
import '../styles/carrito.css';

interface Props { wa: string | null }

const Pend = ({ label = 'COMPLETAR', note }: { label?: string; note: string }) =>
  business.showPendingMarkers ? <span class="pending" title={note}>[{label}]<span class="visually-hidden">: {note}</span></span> : null;

const WaIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M4 20l1.2-4.1A8 8 0 1 1 8.3 19z" />
    <path d="M9.2 8.6c.3-.6.6-.6.9-.6h.6c.2 0 .4.1.5.4l.7 1.7c.1.2 0 .5-.1.6l-.5.6c-.1.2-.1.4 0 .5.6 1 1.4 1.8 2.4 2.4.2.1.4.1.5 0l.6-.6c.2-.2.4-.2.6-.1l1.7.8c.2.1.3.3.3.5 0 .5-.2 1.2-.9 1.5-.6.3-1.6.4-3.4-.5a9.6 9.6 0 0 1-3.6-3.6c-.8-1.5-.6-2.6-.3-3.1z" fill="currentColor" stroke="none" />
  </svg>
);

const FIELD_ORDER = ['name', 'phone', 'people', 'date', 'time', 'occasion'] as const;
const FIELD_ID: Record<string, string> = { name: 'g-name', phone: 'g-phone', people: 'g-people', date: 'g-date', time: 'g-time', occasion: 'g-occasion' };

async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; } catch {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    ta.remove();
    return ok;
  }
}

export default function GrupoForm({ wa }: Props) {
  const today = todayYmd();
  const maxDate = todayYmd(new Date(Date.now() + 120 * 86_400_000));
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [people, setPeople] = useState(8);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [occasion, setOccasion] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [dietary, setDietary] = useState('');
  const [notes, setNotes] = useState('');
  const [attempted, setAttempted] = useState(false);
  const [sent, setSent] = useState<{ url: string | null; id: string } | null>(null);
  const [announce, setAnnounce] = useState('');
  const consultId = useRef(newConsultId());

  // Si ya cargó datos en el pedido, los reutilizamos.
  useEffect(() => { const c = loadCart(); if (c.name) setName(c.name); if (c.phone) setPhone(c.phone); }, []);

  const timeOptions = date ? slotsForDate(date) : [];
  const errors = validateGroup({ name, phone, people, date, time, occasion, timeOptions, today, maxDate });
  const hasErrors = Object.keys(errors).length > 0;
  const err = (k: string) => (attempted ? (errors as Record<string, string>)[k] : undefined);
  const errEl = (k: string) => (err(k) ? <p class="err" id={`ge-${k}`}>{err(k)}</p> : null);

  const data = (placeholder = false): GroupData => ({
    consultId: consultId.current,
    createdLabel: 'el ' + formatPickup(new Date().toISOString()),
    name: name.trim() || (placeholder ? '(sin completar)' : ''),
    phone: phone.trim() || (placeholder ? '(sin completar)' : ''),
    people,
    dayLabel: date ? dayLabel(date) : '(sin elegir)',
    time: time || (placeholder ? '(sin elegir)' : ''),
    occasion: occasion || (placeholder ? '(sin elegir)' : ''),
    interests, dietary, notes,
  });
  const preview = buildGroupMessage(data(true));

  const focusFirst = () => {
    const key = FIELD_ORDER.find((k) => (errors as Record<string, string>)[k]);
    const el = key ? document.getElementById(FIELD_ID[key]) : null;
    el?.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    (el as HTMLElement | null)?.focus({ preventScroll: true });
  };

  const submit = (how: 'wa' | 'copy') => {
    setAttempted(true);
    if (hasErrors) { setAnnounce('Faltan datos: ' + Object.values(errors).join(' ')); setTimeout(focusFirst, 30); return; }
    const text = buildGroupMessage(data());
    const url = wa ? waLink(wa, text) : null;
    setSent({ url, id: consultId.current });
    if (how === 'copy') {
      copyText(text).then((ok) => setAnnounce(ok ? 'Consulta copiada. Pegala en el WhatsApp del local.' : 'No pudimos copiar. Seleccioná el texto de la vista previa.'));
      return;
    }
    if (url && url.length <= MAX_WA_URL) { window.open(url, '_blank', 'noopener'); setAnnounce('Se abrió WhatsApp con tu consulta.'); }
    else setAnnounce(url ? 'La consulta es muy larga para un link: copiala y pegala en WhatsApp.' : 'Falta el número de WhatsApp del local.');
  };

  const toggleInterest = (i: string) => { setSent(null); setInterests((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i])); };
  const changed = <T,>(set: (v: T) => void) => (v: T) => { setSent(null); set(v); };

  return (
    <section class="pedido grupo" aria-labelledby="grupo-title">
      <header class="pedido-head">
        <p class="kicker">Mesa para grupos</p>
        <h2 id="grupo-title" class="display-m">Contanos cómo viene la mesa</h2>
        <p class="note">Es una consulta: te respondemos por WhatsApp si hay lugar. No es una reserva confirmada.</p>
      </header>

      <fieldset class="field">
        <legend>Tus datos</legend>
        <label class="fld"><span>Nombre</span>
          <input id="g-name" type="text" autocomplete="name" maxLength={80} value={name} aria-invalid={!!err('name')} aria-describedby={err('name') ? 'ge-name' : undefined} onInput={(e) => changed(setName)((e.target as HTMLInputElement).value)} />
        </label>
        {errEl('name')}
        <label class="fld"><span>Teléfono (con código de área)</span>
          <input id="g-phone" type="tel" inputMode="tel" autocomplete="tel" maxLength={30} placeholder="249 123-4567" value={phone} aria-invalid={!!err('phone')} aria-describedby={err('phone') ? 'ge-phone' : undefined} onInput={(e) => changed(setPhone)((e.target as HTMLInputElement).value)} />
        </label>
        {errEl('phone')}
      </fieldset>

      <fieldset class="field">
        <legend>La mesa</legend>
        <div class="fld">
          <span id="g-people-l">¿Cuántas personas son?</span>
          <div class="stepper" role="group" aria-labelledby="g-people-l" id="g-people" tabIndex={-1}>
            <button type="button" aria-label="Una persona menos" disabled={people <= 2} onClick={() => changed(setPeople)(Math.max(2, people - 1))}>−</button>
            <output aria-live="polite">{people}</output>
            <button type="button" aria-label="Una persona más" disabled={people >= 80} onClick={() => changed(setPeople)(Math.min(80, people + 1))}>+</button>
          </div>
        </div>
        {errEl('people')}
        <div class="row2">
          <label class="fld"><span>Día</span>
            <input id="g-date" type="date" min={today} max={maxDate} value={date} aria-invalid={!!err('date')} aria-describedby={err('date') ? 'ge-date' : undefined} onInput={(e) => { setSent(null); setDate((e.target as HTMLInputElement).value); setTime(''); }} />
          </label>
          <label class="fld"><span>Hora de llegada</span>
            <select id="g-time" value={time} disabled={!date || timeOptions.length === 0} aria-invalid={!!err('time')} aria-describedby={err('time') ? 'ge-time' : undefined} onChange={(e) => changed(setTime)((e.target as HTMLSelectElement).value)}>
              <option value="">{date ? 'Elegí…' : 'Primero el día'}</option>
              {timeOptions.map((t) => <option value={t} key={t}>{t} h</option>)}
              {date && timeOptions.length > 0 && <option value="a-confirmar">A coordinar</option>}
            </select>
          </label>
        </div>
        {errEl('date')}
        {errEl('time')}
        {!business.hours.verified && <p class="small"><Pend label="VERIFICAR" note="Horario del local sin confirmar." /> Los horarios se confirman con el local.</p>}
        <label class="fld"><span>Ocasión</span>
          <select id="g-occasion" value={occasion} aria-invalid={!!err('occasion')} aria-describedby={err('occasion') ? 'ge-occasion' : undefined} onChange={(e) => changed(setOccasion)((e.target as HTMLSelectElement).value)}>
            <option value="">Elegí…</option>
            {OCCASIONS.map((o) => <option value={o} key={o}>{o}</option>)}
          </select>
        </label>
        {errEl('occasion')}
      </fieldset>

      <fieldset class="field">
        <legend>¿Qué les interesa? <small class="opt">(opcional)</small></legend>
        <div class="choices choices--stack">
          {INTERESTS.map((i) => (
            <label class={`choice choice--slim${interests.includes(i) ? ' is-on' : ''}`} key={i}>
              <input type="checkbox" class="check" checked={interests.includes(i)} onChange={() => toggleInterest(i)} />
              <span><strong>{i}</strong></span>
            </label>
          ))}
        </div>
      </fieldset>

      <label class="fld"><span>¿Alguien con alergias o restricciones? (opcional)</span>
        <input type="text" maxLength={200} placeholder="Ej: 2 celíacos, 1 vegetariano" value={dietary} onInput={(e) => changed(setDietary)((e.target as HTMLInputElement).value)} />
      </label>
      <label class="fld"><span>Aclaraciones (opcional)</span>
        <textarea rows={3} maxLength={500} placeholder="Llevamos torta, necesitamos silla alta, vamos a llegar escalonados…" value={notes} onInput={(e) => changed(setNotes)((e.target as HTMLTextAreaElement).value)} />
      </label>

      {hasErrors && attempted && <p class="err err--box" role="alert">Revisá los datos marcados antes de enviar.</p>}

      <div class="actions">
        <button type="button" class="btn btn--red btn--block" onClick={() => submit('wa')}><WaIcon /> Enviar consulta por WhatsApp</button>
        <button type="button" class="btn btn--outline btn--block" onClick={() => submit('copy')}>Copiar consulta</button>
        {!wa && <a class="btn btn--outline btn--block" href={telUrl()}>Llamar al local</a>}
      </div>
      {!wa && <p class="small"><Pend note="Falta el número de WhatsApp del local en business.json." /> Todavía no está cargado el WhatsApp del local: por ahora usá "Copiar consulta" o llamá.</p>}

      {sent && (
        <div class="sent" role="status">
          <p class="sent-title">Consulta N° {sent.id}</p>
          {sent.url ? <p>Se abrió WhatsApp con tu consulta. <strong>Mandá el mensaje</strong> para que lo veamos. Si no se abrió, <a href={sent.url} target="_blank" rel="noopener">tocá acá</a>.</p> : <p>Copiamos tu consulta para que la pegues en el WhatsApp del local.</p>}
        </div>
      )}

      <details class="preview">
        <summary>Ver cómo le llega al local</summary>
        <pre tabIndex={0} aria-label="Vista previa del mensaje">{preview}</pre>
      </details>
      <p class="visually-hidden" role="status" aria-live="polite">{announce}</p>
    </section>
  );
}
