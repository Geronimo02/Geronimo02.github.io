import { useState } from 'react';
import { business, coffeeAddOns, formatARS, menu } from './data';
import type { Cart } from './App';
import { artFor } from './Carta';

const img = (name: string) => `/images/${name}.webp`;

export default function Pedido({ cart }: { cart: Cart }) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [notes, setNotes] = useState('');
  const [review, setReview] = useState(false);

  const lines = cart.lines.map((line) => {
    const item = menu.find((m) => m.id === line.itemId);
    const variant = item?.variants.find((v) => v.label === line.variant);
    const addOn = coffeeAddOns.find((a) => a.id === line.addOnId);
    return { line, item, variant, addOn };
  }).filter((l) => l.item && l.variant);

  const unit = (l: (typeof lines)[number]) => l.variant!.price + (l.addOn?.price || 0);
  const subtotal = lines.reduce((s, l) => s + unit(l) * l.line.quantity, 0);
  const valid = name.trim() !== '' && contact.trim() !== '' && lines.length > 0;

  const message = [
    `Hola Negro Mercado, quiero consultar este pedido:`,
    ...lines.map((l) => `- ${l.line.quantity} x ${l.item!.name} (${l.variant!.label}${l.addOn ? ' + ' + l.addOn.label : ''}) · ${formatARS(unit(l) * l.line.quantity)}`),
    `Subtotal de referencia: ${formatARS(subtotal)}`,
    `Nombre: ${name}`,
    `Contacto: ${contact}`,
    notes ? `Observaciones: ${notes}` : '',
    'Entiendo que el pedido no está aceptado hasta que el local lo confirme.',
  ].filter(Boolean).join('\n');

  function next() {
    if (!valid) return;
    if (!review) { setReview(true); return; }
    window.open(`https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  }

  return (
    <>
      <section className="page-hero page-hero-stack">
        <p className="script">casi listo</p>
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
                      <p>{l.variant!.label}{l.addOn ? ` + ${l.addOn.label}` : ''} · {formatARS(unit(l))}</p>
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
              <div className="subtotal"><span>Subtotal de referencia</span><strong>{formatARS(subtotal)}</strong></div>
              <p className="muted">El precio y la disponibilidad se confirman por WhatsApp. El pedido aún no está aceptado.</p>
              <button className="link-button" onClick={cart.clear}>Vaciar pedido</button>
            </>
          )}
        </section>

        <aside className="pedido-form">
          <h2>tus datos</h2>
          <label>Tu nombre<input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
          <label>Tu contacto<input value={contact} onChange={(e) => setContact(e.target.value)} autoComplete="tel" placeholder="Teléfono o WhatsApp" /></label>
          <label>Observaciones<textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Aclaraciones para el local" /></label>
          <p className="form-note">La modalidad de entrega se coordina con el local por WhatsApp.</p>
          {review && <p className="review">Revisá los productos, cantidades y datos. Al continuar se abrirá WhatsApp con el mensaje listo para enviar.</p>}
          <button className="cta-button" disabled={!valid} onClick={next}>{review ? 'Continuar por WhatsApp ↗' : 'Revisar pedido →'}</button>
          {!valid && <p className="form-note center">Ingresá nombre y contacto para continuar.</p>}
        </aside>
      </div>
    </>
  );
}
