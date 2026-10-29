import { useEffect, useState } from 'react';
import { api, type OrderItem, type OrderStatus } from './api';
import { coffeeAddOns, formatARS } from './data';
import { artFor } from './Carta';
import { useMenu } from './menu';
import type { Cart } from './App';
import type { TableInfo } from './table';

const img = (name: string) => `/images/${name}.webp`;
const lastKey = 'negro-mercado-v3-ultimo-pedido';
const labels: Record<OrderStatus, { title: string; text: string }> = {
  new: { title: 'Recibimos tu pedido', text: 'El equipo lo está viendo.' },
  preparing: { title: 'Lo estamos preparando', text: 'Ya está en marcha.' },
  ready: { title: 'Listo, va para tu mesa', text: 'En un momento lo tenés.' },
  delivered: { title: 'Entregado', text: '¡Que lo disfrutes!' },
  cancelled: { title: 'Pedido cancelado', text: 'Si fue un error, avisale al equipo.' },
};

function Tracker({ id, onNew }: { id: string; onNew: () => void }) {
  const [order, setOrder] = useState<Awaited<ReturnType<typeof api.order>> | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let alive = true;
    const tick = () => api.order(id).then((o) => { if (alive) { setOrder(o); setError(''); } }).catch((e) => { if (alive) setError(e.message); });
    tick();
    const t = setInterval(tick, 2500);
    window.addEventListener('storage', tick);
    return () => { alive = false; clearInterval(t); window.removeEventListener('storage', tick); };
  }, [id]);
  if (error && !order) return <div className="empty-card"><p>{error}</p><button className="link-button" onClick={onNew}>Hacer otro pedido</button></div>;
  if (!order) return <div className="empty-card"><p>Cargando tu pedido…</p></div>;
  const steps: OrderStatus[] = ['new', 'preparing', 'ready', 'delivered'];
  const current = steps.indexOf(order.status);
  const info = labels[order.status];
  return (
    <div className="tracker" aria-live="polite">
      <p className="eyebrow">Pedido #{order.number} · Mesa {order.table}</p>
      <h2>{info.title}</h2>
      <p>{info.text}</p>
      {order.status !== 'cancelled' && (
        <ol className="steps" aria-label="Estado del pedido">
          {['Recibido', 'En preparación', 'Listo', 'Entregado'].map((s, i) => <li key={s} className={i <= current ? 'done' : ''} aria-current={i === current ? 'step' : undefined}>{s}</li>)}
        </ol>
      )}
      <ul className="tracker-items">
        {order.items.map((it: OrderItem, i) => <li key={i}><span>{it.qty} × {it.name} ({it.variant}{it.addOn ? ` + ${it.addOn}` : ''})</span><strong>{formatARS(it.unit * it.qty)}</strong></li>)}
      </ul>
      <p className="subtotal"><span>Total</span><strong>{formatARS(order.total)}</strong></p>
      <button className="link-button" onClick={onNew}>Hacer otro pedido</button>
    </div>
  );
}

export default function Pedido({ cart, table }: { cart: Cart; table: TableInfo | null }) {
  const { items, accepting, soldOut } = useMenu();
  const [customer, setCustomer] = useState('');
  const [notes, setNotes] = useState('');
  const [review, setReview] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [lastId, setLastId] = useState<string | null>(() => { try { return localStorage.getItem(lastKey); } catch { return null; } });

  const lines = cart.lines.map((line) => {
    const item = items.find((m) => m.id === line.itemId);
    const variant = item?.variants.find((v) => v.label === line.variant);
    const addOn = coffeeAddOns.find((a) => a.id === line.addOnId);
    return { line, item, variant, addOn };
  }).filter((l) => l.item && l.variant);
  const unit = (l: (typeof lines)[number]) => l.variant!.price + (l.addOn?.price || 0);
  const subtotal = lines.reduce((s, l) => s + unit(l) * l.line.quantity, 0);
  const blockedByStock = lines.some((l) => soldOut.has(l.item!.id));
  const canSend = !!table && accepting && lines.length > 0 && !blockedByStock;

  async function send() {
    if (!table || !canSend) return;
    if (!review) { setReview(true); return; }
    setSending(true); setError('');
    try {
      const r = await api.createOrder({
        table: table.table, k: table.k, customer, notes,
        items: lines.map((l) => ({ id: l.item!.id, variant: l.line.variant, addOnId: l.line.addOnId, qty: l.line.quantity })),
      });
      try { localStorage.setItem(lastKey, r.id); } catch { /* nada */ }
      setLastId(r.id);
      cart.clear();
      setReview(false);
    } catch (e) { setError((e as Error).message); setReview(false); }
    finally { setSending(false); }
  }

  function newOrder() { try { localStorage.removeItem(lastKey); } catch { /* nada */ } setLastId(null); }

  if (lastId && lines.length === 0) {
    return (
      <>
        <section className="page-hero page-hero-stack"><p className="script">gracias</p><h1 className="big-title">tu pedido<span>.</span></h1></section>
        <div className="pedido-layout"><section><Tracker id={lastId} onNew={newOrder} /></section></div>
      </>
    );
  }

  return (
    <>
      <section className="page-hero page-hero-stack">
        <p className="script">{table ? `mesa ${table.table}` : 'casi listo'}</p>
        <h1 className="big-title">tu pedido<span>.</span></h1>
      </section>

      <div className="pedido-layout">
        <section aria-label="Productos del pedido">
          {lines.length === 0 ? (
            <div className="empty-card">
              <p className="ghost-o" aria-hidden="true">ö</p>
              <p>Tu pedido todavía está vacío.</p>
              <a className="pill pill-green" href="/carta/">Explorar la carta<span className="pill-arrow" aria-hidden="true">↗</span></a>
            </div>
          ) : (
            <>
              <ul className="lines">
                {lines.map((l) => (
                  <li key={l.line.key}>
                    <div className="line-thumb">{artFor(l.item!) ? <img src={img(artFor(l.item!)!)} alt="" /> : <span className="ghost-o" aria-hidden="true">ö</span>}</div>
                    <div className="line-info">
                      <h2>{l.item!.name}</h2>
                      <p>{l.variant!.label}{l.addOn ? ` + ${l.addOn.label}` : ''} · {formatARS(unit(l))}{soldOut.has(l.item!.id) ? ' · agotado por hoy' : ''}</p>
                    </div>
                    <div className="qty" role="group" aria-label={`Cantidad de ${l.item!.name}`}>
                      <button onClick={() => cart.setQty(l.line.key, l.line.quantity - 1)} aria-label={`Quitar una unidad de ${l.item!.name}`}>−</button>
                      <span>{l.line.quantity}</span>
                      <button onClick={() => cart.setQty(l.line.key, l.line.quantity + 1)} aria-label={`Sumar una unidad de ${l.item!.name}`}>+</button>
                    </div>
                    <strong className="line-total">{formatARS(unit(l) * l.line.quantity)}</strong>
                    <button className="line-remove" onClick={() => cart.setQty(l.line.key, 0)}>Eliminar</button>
                  </li>
                ))}
              </ul>
              <div className="subtotal"><span>Total</span><strong>{formatARS(subtotal)}</strong></div>
              <p className="muted">Pedido para consumir en el local. Los precios se confirman al servirte.</p>
              <button className="link-button" onClick={cart.clear}>Vaciar pedido</button>
            </>
          )}
        </section>

        <aside className="pedido-form">
          {table ? <h2>mesa {table.table}</h2> : <h2>falta tu mesa</h2>}
          {!table && <p className="review">Para enviar el pedido escaneá el QR que está en tu mesa. Así sabemos a dónde llevarlo.</p>}
          {!accepting && <p className="review">Por ahora no estamos tomando pedidos desde la mesa. Pedile al equipo.</p>}
          <label>Tu nombre (opcional)<input value={customer} maxLength={40} onChange={(e) => setCustomer(e.target.value)} autoComplete="given-name" /></label>
          <label>Aclaraciones<textarea rows={3} maxLength={240} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Sin azúcar, para compartir…" /></label>
          {review && <p className="review">Revisá los productos y la mesa. Al confirmar, el pedido le llega al equipo.</p>}
          {error && <p className="review error" role="alert">{error}</p>}
          <button className="cta-button" disabled={!canSend || sending} onClick={send}>{sending ? 'Enviando…' : review ? `Confirmar y enviar a la mesa ${table?.table}` : 'Revisar pedido →'}</button>
          {lines.length === 0 && table && <p className="form-note center">Sumá algo de la carta para continuar.</p>}
          {blockedByStock && <p className="form-note center">Sacá los productos agotados para continuar.</p>}
        </aside>
      </div>
    </>
  );
}
