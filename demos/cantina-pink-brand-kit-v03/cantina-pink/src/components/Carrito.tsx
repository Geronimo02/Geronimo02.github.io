import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { load, save, setQty, setNote, clearLines, countOf, MAX_QTY, type CartState, type Mode } from '../lib/cart';
import { findItem, isOrderable, formatPrice, type MenuItem } from '../lib/menu';
import { business, pickupDays, canAsap, openStatus, formatPickup, isValidPickup } from '../lib/hours';
import { buildMessage, newOrderId, validate, waLink, totalsOf, money, MAX_WA_URL, type OrderData } from '../lib/order';
import '../styles/carrito.css';

interface Props { wa: string | null }

const D = business.delivery as unknown as {
  enabled: boolean; verified: boolean; zone: string | null; fee: number | null; freeOver: number | null; minOrder: number | null; leadMinutes: number;
};
const PAY = business.payment as unknown as { verified: boolean; retiro: string[]; delivery: string[] };
const SHOP = `${business.address.street}, ${business.address.corner}, ${business.address.city}`;

const Pend = ({ label = 'VERIFICAR', note }: { label?: string; note: string }) =>
  business.showPendingMarkers ? <span class="pending" title={note}>[{label}]<span class="visually-hidden">: {note}</span></span> : null;

const WaIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M4 20l1.2-4.1A8 8 0 1 1 8.3 19z" />
    <path d="M9.2 8.6c.3-.6.6-.6.9-.6h.6c.2 0 .4.1.5.4l.7 1.7c.1.2 0 .5-.1.6l-.5.6c-.1.2-.1.4 0 .5.6 1 1.4 1.8 2.4 2.4.2.1.4.1.5 0l.6-.6c.2-.2.4-.2.6-.1l1.7.8c.2.1.3.3.3.5 0 .5-.2 1.2-.9 1.5-.6.3-1.6.4-3.4-.5a9.6 9.6 0 0 1-3.6-3.6c-.8-1.5-.6-2.6-.3-3.1z" fill="currentColor" stroke="none" />
  </svg>
);

const FIELD_ORDER = ['lines', 'name', 'phone', 'street', 'when', 'payment', 'cashWith', 'min'] as const;
const FIELD_ID: Record<string, string> = { lines: 'cart-lines', name: 'f-name', phone: 'f-phone', street: 'f-street', when: 'f-when', payment: 'f-pay-0', cashWith: 'f-cash', min: 'cart-lines' };

const onlyDigits = (v: string) => v.replace(/\D/g, '');

export default function Carrito({ wa }: Props) {
  const [s, setS] = useState<CartState | null>(null);
  const [wide, setWide] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [attempted, setAttempted] = useState(false);
  const [sent, setSent] = useState<{ orderId: string; url: string | null; text: string } | null>(null);
  const [announce, setAnnounce] = useState('');
  const [day, setDay] = useState('');
  const dlg = useRef<HTMLDialogElement>(null);
  const orderId = useRef(newOrderId());

  // Estado inicial desde localStorage (después de hidratar) y sincronización con los botones de la carta.
  useEffect(() => {
    const first = load();
    const clean = { ...first, lines: first.lines.filter((l) => { const it = findItem(l.id); return it && isOrderable(it); }) };
    if (clean.lines.length !== first.lines.length) save(clean, 'island');
    setS(clean);
    const onCart = (e: Event) => { if ((e as CustomEvent).detail?.source !== 'island') setS(load()); };
    window.addEventListener('cp:cart', onCart);
    window.addEventListener('storage', onCart);
    return () => { window.removeEventListener('cp:cart', onCart); window.removeEventListener('storage', onCart); };
  }, []);

  useEffect(() => {
    const mq = matchMedia('(min-width: 960px)');
    const f = () => setWide(mq.matches);
    f();
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, []);

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60_000); return () => clearInterval(t); }, []);

  // En celular el pedido se abre como pantalla completa: desde el botón del encabezado o desde #pedido.
  useEffect(() => {
    if (wide === null || wide) return;
    if (location.hash === '#pedido') setOpen(true);
    const onLink = (e: Event) => {
      const a = (e.target as HTMLElement).closest('[data-cart-link]');
      if (!a || !location.pathname.startsWith('/carta')) return;
      e.preventDefault();
      setOpen(true);
    };
    document.addEventListener('click', onLink);
    return () => document.removeEventListener('click', onLink);
  }, [wide]);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open, wide]);

  const lines = useMemo(() => (s?.lines ?? [])
    .map((l) => ({ item: findItem(l.id) as MenuItem | undefined, qty: l.qty, note: l.note }))
    .filter((l): l is { item: MenuItem; qty: number; note: string | undefined } => !!l.item && isOrderable(l.item)), [s]);

  const count = s ? countOf(s) : 0;
  const mode: Mode = s?.mode === 'delivery' && D.enabled ? 'delivery' : 'retiro';
  const lead = mode === 'delivery' ? D.leadMinutes : business.pickup.leadMinutes;
  const days = useMemo(() => pickupDays(now, lead), [now, lead]);
  const asapOk = canAsap(now);
  const status = openStatus(now);
  const subtotal = lines.reduce((t, l) => t + l.qty * (l.item.price ?? 0), 0);
  const fee = mode === 'delivery' ? (D.freeOver !== null && subtotal >= D.freeOver ? 0 : D.fee) : 0;
  const payOptions = PAY[mode];
  const cashWithNum = s && s.cashWith ? Number(onlyDigits(s.cashWith)) || null : null;
  const whenKind = s?.whenKind === 'asap' && asapOk ? 'asap' : 'slot';
  const whenOk = whenKind === 'asap' ? asapOk : !!s && isValidPickup(s.slot, now, lead);
  const errors = s ? validate({
    lineCount: lines.length, mode, name: s.name, phone: s.phone, street: s.street, whenOk, payment: s.payment,
    paymentOptions: payOptions, cashWith: s.payment.startsWith('Efectivo') ? cashWithNum : null, subtotal, minOrder: D.minOrder,
  }) : {};
  const hasErrors = Object.keys(errors).length > 0;

  // Día seleccionado: el del turno elegido, o el primero disponible.
  const slotDay = s?.slot ? s.slot.slice(0, 10) : '';
  const currentDay = days.find((d) => d.ymd === (day || slotDay)) ?? days[0];

  const update = (patch: Partial<CartState> | ((p: CartState) => CartState)) => {
    if (!s) return;
    const next = typeof patch === 'function' ? patch(s) : { ...s, ...patch };
    setS(next);
    save(next, 'island');
    setSent(null);
  };

  const orderData = (placeholder = false): OrderData => ({
    orderId: orderId.current,
    createdLabel: 'el ' + formatPickup(now.toISOString()),
    mode,
    whenLabel: whenKind === 'asap' ? 'Lo antes posible (confirmenme el tiempo)' : s && s.slot ? formatPickup(s.slot) : '(sin elegir)',
    name: s?.name.trim() || (placeholder ? '(sin completar)' : ''),
    phone: s?.phone.trim() || (placeholder ? '(sin completar)' : ''),
    street: s?.street ?? '',
    ref: s?.ref ?? '',
    payment: s?.payment || (placeholder ? '(sin elegir)' : ''),
    cashWith: s?.payment.startsWith('Efectivo') ? cashWithNum : null,
    notes: s?.notes ?? '',
    lines: lines.map((l) => ({ name: l.item.name, qty: l.qty, unitPrice: l.item.price ?? 0, note: l.note })),
    deliveryFee: fee,
    shopAddress: SHOP,
  });

  const preview = lines.length ? buildMessage(orderData(true)) : '';
  const totals = totalsOf({ lines: orderData().lines, mode, deliveryFee: fee });

  const focusFirstError = () => {
    const key = FIELD_ORDER.find((k) => (errors as Record<string, string>)[k]);
    if (!key) return;
    const el = document.getElementById(FIELD_ID[key]);
    el?.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    (el as HTMLElement | null)?.focus({ preventScroll: true });
  };

  const submit = (how: 'wa' | 'copy') => {
    setAttempted(true);
    if (hasErrors) {
      setAnnounce(`Faltan datos: ${Object.values(errors).join(' ')}`);
      setTimeout(focusFirstError, 30);
      return;
    }
    const text = buildMessage(orderData());
    if (how === 'copy') {
      copyText(text).then((ok) => setAnnounce(ok ? 'Pedido copiado. Pegalo en el WhatsApp del local.' : 'No pudimos copiar. Seleccioná el texto de la vista previa y copialo.'));
      setSent({ orderId: orderId.current, url: wa ? waLink(wa, text) : null, text });
      return;
    }
    const url = wa ? waLink(wa, text) : null;
    setSent({ orderId: orderId.current, url, text });
    if (url && url.length <= MAX_WA_URL) {
      window.open(url, '_blank', 'noopener');
      setAnnounce('Se abrió WhatsApp con tu pedido. Mandá el mensaje para que lo recibamos.');
    } else {
      setAnnounce(url ? 'El pedido es muy largo para mandarlo en un link. Copialo y pegalo en WhatsApp.' : 'Falta el número de WhatsApp del local.');
    }
  };

  const clearAll = () => {
    update((p) => clearLines(p));
    orderId.current = newOrderId();
    setAttempted(false);
    setSent(null);
    setAnnounce('Pedido vacío.');
  };

  const err = (k: string) => (attempted ? (errors as Record<string, string>)[k] : undefined);
  const errEl = (k: string) => (err(k) ? <p class="err" id={`e-${k}`}>{err(k)}</p> : null);

  const needsLong = sent && sent.url && sent.url.length > MAX_WA_URL;

  const panel = !s ? (
    <p class="note">Cargando tu pedido…</p>
  ) : (
    <section class="pedido" aria-labelledby="pedido-title">
      <header class="pedido-head">
        <p class="kicker">Tu pedido</p>
        <h2 id="pedido-title" class="display-m">Armá tu pedido</h2>
      </header>

      {!status.open && (
        <p class="banner" role="note"><strong>Ahora estamos cerrados.</strong> {status.label.replace('Cerrado · ', '')}. Podés dejar el pedido programado para más tarde.</p>
      )}

      {lines.length === 0 ? (
        <div class="empty" id="cart-lines" tabIndex={-1}>
          <p class="empty-title">Todavía no hay nada acá.</p>
          <p>Elegí algo de la carta y tocá <strong>Agregar</strong>. Lo que dice "solo en el local" no se pide online.</p>
          {err('lines') && <p class="err" role="alert">{err('lines')}</p>}
        </div>
      ) : (
        <>
          <ul class="lines" id="cart-lines" tabIndex={-1} aria-label="Productos del pedido">
            {lines.map(({ item, qty, note }) => (
              <li class="line" key={item.id}>
                <div class="line-top">
                  <div>
                    <p class="line-name">{item.name}</p>
                    <p class="line-unit">{formatPrice(item.price)} c/u</p>
                  </div>
                  <p class="line-total">{money(qty * (item.price ?? 0))}</p>
                </div>
                <div class="line-ctrl">
                  <div class="stepper stepper--sm" role="group" aria-label={`Cantidad de ${item.name}`}>
                    <button type="button" aria-label={`Sacar uno de ${item.name}`} onClick={() => update((p) => setQty(p, item.id, qty - 1))}>−</button>
                    <output>{qty}</output>
                    <button type="button" aria-label={`Agregar uno más de ${item.name}`} disabled={qty >= MAX_QTY} onClick={() => update((p) => setQty(p, item.id, qty + 1))}>+</button>
                  </div>
                  <button type="button" class="link-btn" onClick={() => update((p) => setQty(p, item.id, 0))} aria-label={`Quitar ${item.name} del pedido`}>Quitar</button>
                </div>
                <details class="line-note" open={!!note}>
                  <summary>{note ? 'Aclaración' : 'Agregar aclaración'}</summary>
                  <label class="visually-hidden" for={`n-${item.id}`}>Aclaración para {item.name}</label>
                  <input id={`n-${item.id}`} type="text" maxLength={140} placeholder="Ej: sin cebolla, bien cocida" value={note ?? ''} onInput={(e) => update((p) => setNote(p, item.id, (e.target as HTMLInputElement).value))} />
                </details>
              </li>
            ))}
          </ul>
          {err('min') && <p class="err" role="alert">{err('min')}</p>}

          <fieldset class="field">
            <legend>¿Cómo lo querés?</legend>
            <div class="choices">
              <label class={`choice${mode === 'retiro' ? ' is-on' : ''}`}>
                <input type="radio" name="mode" value="retiro" checked={mode === 'retiro'} onChange={() => update({ mode: 'retiro', payment: '' })} />
                <span><strong>Retiro en el local</strong><small>{business.address.street} · sin costo</small></span>
              </label>
              {D.enabled && (
                <label class={`choice${mode === 'delivery' ? ' is-on' : ''}`}>
                  <input type="radio" name="mode" value="delivery" checked={mode === 'delivery'} onChange={() => update({ mode: 'delivery', payment: '' })} />
                  <span>
                    <strong>Delivery</strong>
                    <small>
                      {D.zone ? `${D.zone} · ` : ''}
                      {D.fee === null ? 'envío a confirmar' : D.fee === 0 ? 'envío gratis' : `envío ${money(D.fee)}`}
                      {D.minOrder !== null ? ` · mínimo ${money(D.minOrder)}` : ''}
                      {!D.verified && <> <Pend note="Zona de reparto, costo y mínimo de delivery sin confirmar." /></>}
                    </small>
                  </span>
                </label>
              )}
            </div>
          </fieldset>

          <fieldset class="field" aria-describedby={err('when') ? 'e-when' : undefined}>
            <legend>{mode === 'retiro' ? '¿Cuándo pasás a retirar?' : '¿Cuándo querés que llegue?'}</legend>
            <div class="choices choices--stack">
              <label class={`choice choice--slim${whenKind === 'asap' ? ' is-on' : ''}${asapOk ? '' : ' is-off'}`}>
                <input type="radio" name="when" disabled={!asapOk} checked={whenKind === 'asap'} onChange={() => update({ whenKind: 'asap' })} />
                <span><strong>Lo antes posible</strong><small>{asapOk ? 'Te confirmamos el tiempo por WhatsApp' : 'Disponible cuando el local está abierto'}</small></span>
              </label>
              <label class={`choice choice--slim${whenKind === 'slot' ? ' is-on' : ''}`}>
                <input type="radio" name="when" checked={whenKind === 'slot'} onChange={() => update({ whenKind: 'slot' })} />
                <span><strong>Elegir día y hora</strong></span>
              </label>
            </div>
            {whenKind === 'slot' && (days.length === 0 ? (
              <p class="note">No hay horarios disponibles en los próximos días. Escribinos por WhatsApp.</p>
            ) : (
              <div class="row2">
                <label class="fld"><span>Día</span>
                  <select value={currentDay?.ymd} onChange={(e) => { setDay((e.target as HTMLSelectElement).value); update({ slot: '' }); }}>
                    {days.map((d) => <option value={d.ymd} key={d.ymd}>{d.label}</option>)}
                  </select>
                </label>
                <label class="fld"><span>Hora</span>
                  <select id="f-when" value={s.slot} aria-invalid={!!err('when')} onChange={(e) => update({ slot: (e.target as HTMLSelectElement).value })}>
                    <option value="">Elegí…</option>
                    {currentDay?.slots.map((x) => <option value={x.value} key={x.value}>{x.label} h</option>)}
                  </select>
                </label>
              </div>
            ))}
            {errEl('when')}
            {!business.hours.verified && <p class="small"><Pend note="Horario del local sin confirmar." /> Los horarios se confirman con el local.</p>}
          </fieldset>

          <fieldset class="field">
            <legend>Tus datos</legend>
            <label class="fld"><span>Nombre</span>
              <input id="f-name" type="text" autocomplete="name" maxLength={80} value={s.name} aria-invalid={!!err('name')} aria-describedby={err('name') ? 'e-name' : undefined} onInput={(e) => update({ name: (e.target as HTMLInputElement).value })} />
            </label>
            {errEl('name')}
            <label class="fld"><span>Teléfono (con código de área)</span>
              <input id="f-phone" type="tel" inputMode="tel" autocomplete="tel" maxLength={30} placeholder="249 123-4567" value={s.phone} aria-invalid={!!err('phone')} aria-describedby={err('phone') ? 'e-phone' : undefined} onInput={(e) => update({ phone: (e.target as HTMLInputElement).value })} />
            </label>
            {errEl('phone')}
            {mode === 'delivery' && (
              <>
                <label class="fld"><span>Dirección de entrega</span>
                  <input id="f-street" type="text" autocomplete="street-address" maxLength={160} placeholder="Calle, número, piso o depto" value={s.street} aria-invalid={!!err('street')} aria-describedby={err('street') ? 'e-street' : undefined} onInput={(e) => update({ street: (e.target as HTMLInputElement).value })} />
                </label>
                {errEl('street')}
                <label class="fld"><span>Referencias (opcional)</span>
                  <input id="f-ref" type="text" maxLength={200} placeholder="Portón negro, timbre 2, entre calles…" value={s.ref} onInput={(e) => update({ ref: (e.target as HTMLInputElement).value })} />
                </label>
              </>
            )}
          </fieldset>

          <fieldset class="field" aria-describedby={err('payment') ? 'e-payment' : undefined}>
            <legend>{mode === 'retiro' ? 'Cómo pagás al retirar' : 'Cómo pagás al recibir'}</legend>
            <div class="choices choices--stack">
              {payOptions.map((o, i) => (
                <label class={`choice choice--slim${s.payment === o ? ' is-on' : ''}`} key={o}>
                  <input id={`f-pay-${i}`} type="radio" name="payment" value={o} checked={s.payment === o} onChange={() => update({ payment: o })} />
                  <span><strong>{o}</strong></span>
                </label>
              ))}
            </div>
            {errEl('payment')}
            {s.payment.startsWith('Efectivo') && (
              <>
                <label class="fld"><span>¿Con cuánto abonás? (opcional, para llevar el vuelto)</span>
                  <input id="f-cash" type="text" inputMode="numeric" maxLength={9} placeholder="Ej: 50000" value={s.cashWith} aria-invalid={!!err('cashWith')} onInput={(e) => update({ cashWith: onlyDigits((e.target as HTMLInputElement).value) })} />
                </label>
                {errEl('cashWith')}
              </>
            )}
            <p class="small">El pago se hace en persona: no se cobra nada online. {!PAY.verified && <Pend note="Medios de pago sin confirmar." />}</p>
          </fieldset>

          <label class="fld"><span>Aclaraciones generales (opcional)</span>
            <textarea rows={3} maxLength={500} placeholder="Alergias, traer cubiertos, cortar en porciones…" value={s.notes} onInput={(e) => update({ notes: (e.target as HTMLTextAreaElement).value })} />
          </label>

          <dl class="sum" aria-label="Resumen del pedido">
            <div><dt>Subtotal</dt><dd>{money(totals.subtotal)}</dd></div>
            {mode === 'delivery' && <div><dt>Envío</dt><dd>{totals.feePending ? 'A confirmar' : totals.fee === 0 ? 'Gratis' : money(totals.fee ?? 0)}</dd></div>}
            <div class="sum-total"><dt>Total{totals.feePending ? ' (sin envío)' : ''}</dt><dd>{money(totals.total)}</dd></div>
          </dl>

          {hasErrors && attempted && <p class="err err--box" role="alert">Revisá los datos marcados antes de enviar.</p>}

          <div class="actions">
            <button type="button" class="btn btn--red btn--block" onClick={() => submit('wa')}><WaIcon /> Enviar pedido por WhatsApp</button>
            <button type="button" class="btn btn--outline btn--block" onClick={() => submit('copy')}>Copiar pedido</button>
          </div>
          {!wa && <p class="small"><Pend label="COMPLETAR" note="Falta el número de WhatsApp del local en business.json." /> Todavía no está cargado el WhatsApp del local: por ahora solo funciona "Copiar pedido".</p>}
          <p class="small">Se abre WhatsApp con el mensaje armado. El pedido no se confirma hasta que el local te responda.</p>

          {sent && (
            <div class="sent" role="status">
              <p class="sent-title">Pedido N° {sent.orderId}</p>
              {sent.url && !needsLong ? (
                <p>Se abrió WhatsApp con tu pedido. <strong>Mandá el mensaje</strong> para que lo recibamos. Si no se abrió, <a href={sent.url} target="_blank" rel="noopener">tocá acá</a> o copialo.</p>
              ) : needsLong ? (
                <p>Tu pedido es muy largo para mandarlo en un link. Tocá <strong>Copiar pedido</strong> y pegalo en el WhatsApp del local.</p>
              ) : (
                <p>Copiamos tu pedido para que lo pegues en el WhatsApp del local.</p>
              )}
              <button type="button" class="link-btn" onClick={clearAll}>Ya lo mandé: vaciar pedido</button>
            </div>
          )}

          <details class="preview">
            <summary>Ver cómo le llega al local</summary>
            <pre tabIndex={0} aria-label="Vista previa del mensaje">{preview}</pre>
          </details>

          <button type="button" class="link-btn link-btn--muted" onClick={clearAll}>Vaciar pedido</button>
        </>
      )}
      <p class="visually-hidden" role="status" aria-live="polite">{announce}</p>
    </section>
  );

  if (wide === null) return <div class="cart-skeleton" aria-hidden="true" />;
  if (wide) return <div class="cart-panel">{panel}</div>;

  return (
    <>
      {count > 0 && !open && (
        <button type="button" class="cart-bar" onClick={() => setOpen(true)}>
          <span class="cart-bar-count">{count}</span>
          <span class="cart-bar-label">Ver mi pedido</span>
          <span class="cart-bar-total">{money(subtotal)}</span>
        </button>
      )}
      <dialog ref={dlg} class="sheet" aria-labelledby="pedido-title" onClose={() => setOpen(false)}>
        <div class="sheet-bar">
          <button type="button" class="sheet-close" onClick={() => setOpen(false)} aria-label="Cerrar pedido y volver a la carta">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            <span>Volver a la carta</span>
          </button>
        </div>
        {panel}
      </dialog>
    </>
  );
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    ta.remove();
    return ok;
  }
}
