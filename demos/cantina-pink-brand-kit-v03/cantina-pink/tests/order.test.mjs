// Uso: node --test tests/
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMessage, validate, totalsOf, money, newOrderId, waLink, MAX_WA_URL } from '../src/lib/order.ts';

const base = {
  orderId: 'CP-2310-A7K', createdLabel: 'el jueves 23/10 a las 21:08 h', mode: 'retiro', whenLabel: 'viernes 24/10 a las 21:15 h',
  name: 'Juan Pérez', phone: '249 123-4567', street: '', ref: '', payment: 'Efectivo', cashWith: null, notes: '',
  lines: [
    { name: 'Muzzarella', qty: 2, unitPrice: 16500, note: 'sin aceitunas' },
    { name: 'Milanesa XL para compartir', qty: 1, unitPrice: 28500 },
  ],
  deliveryFee: null, shopAddress: 'San Martín 501, esquina Yrigoyen, Tandil',
};

test('totales de retiro no suman envío', () => {
  const t = totalsOf(base);
  assert.equal(t.subtotal, 61500);
  assert.equal(t.fee, 0);
  assert.equal(t.total, 61500);
  assert.equal(t.feePending, false);
});

test('delivery con envío a confirmar: total sin envío y aviso', () => {
  const t = totalsOf({ ...base, mode: 'delivery' });
  assert.equal(t.feePending, true);
  assert.equal(t.total, 61500);
});

test('delivery con envío fijo y gratis', () => {
  assert.equal(totalsOf({ ...base, mode: 'delivery', deliveryFee: 3000 }).total, 64500);
  assert.equal(totalsOf({ ...base, mode: 'delivery', deliveryFee: 0 }).total, 61500);
});

test('mensaje de retiro incluye todo el detalle', () => {
  const m = buildMessage(base);
  for (const frag of ['PEDIDO WEB - CANTINA PINK', 'CP-2310-A7K', 'Nombre: Juan Pérez', 'Teléfono: 249 123-4567', 'RETIRO EN EL LOCAL',
    'San Martín 501', 'viernes 24/10 a las 21:15 h', '1) 2 x Muzzarella', '$16.500 c/u = $33.000', 'Aclaración: sin aceitunas',
    '2) 1 x Milanesa XL para compartir', 'Productos: 3', 'Subtotal: $61.500', '*TOTAL: $61.500*', 'Efectivo (se abona al retirar)']) {
    assert.ok(m.includes(frag), 'falta: ' + frag + '\n' + m);
  }
  assert.ok(!m.includes('Envío'));
});

test('mensaje de delivery incluye dirección, referencias y envío', () => {
  const m = buildMessage({ ...base, mode: 'delivery', street: 'Rivadavia 123, 2° B', ref: 'portón negro', deliveryFee: 3000, payment: 'Transferencia' });
  for (const frag of ['DELIVERY', 'Dirección: Rivadavia 123, 2° B', 'Referencias: portón negro', 'Entrega:', 'Envío: $3.000', '*TOTAL: $64.500*', 'se abona al recibir']) {
    assert.ok(m.includes(frag), 'falta: ' + frag);
  }
});

test('envío a confirmar se indica y el total lo aclara', () => {
  const m = buildMessage({ ...base, mode: 'delivery', street: 'Rivadavia 123', deliveryFee: null });
  assert.ok(m.includes('Envío: a confirmar'));
  assert.ok(m.includes('*TOTAL (sin envío): $61.500*'));
});

test('vuelto cuando abona con más', () => {
  assert.ok(buildMessage({ ...base, cashWith: 70000 }).includes('Abona con $70.000 - vuelto $8.500'));
  assert.ok(buildMessage({ ...base, cashWith: 61500 }).includes('Abona con $61.500'));
});

test('el texto del cliente no rompe el formato de WhatsApp', () => {
  const m = buildMessage({ ...base, name: '*Juan*_ ~x~', notes: 'sin   *cebolla*\n\n por favor' });
  assert.ok(m.includes('Nombre: Juan x'));
  assert.ok(m.includes('sin cebolla por favor'));
});

test('aclaraciones solo si hay', () => {
  assert.ok(!buildMessage(base).includes('ACLARACIONES'));
  assert.ok(buildMessage({ ...base, notes: 'Traer cubiertos' }).includes('ACLARACIONES'));
});

test('link de WhatsApp codifica el texto y limpia el número', () => {
  const l = waLink('+54 9 2494 44-0808', 'Hola & chau\n2 x 3');
  assert.ok(l.startsWith('https://wa.me/5492494440808?text='));
  assert.ok(!l.includes('\n') && !l.includes(' '));
  assert.equal(decodeURIComponent(l.split('text=')[1]), 'Hola & chau\n2 x 3');
});

const many = (n, note = '') => Array.from({ length: n }, (_, i) => ({ name: 'Milanesa XL para compartir ' + i, qty: 3, unitPrice: 12345, note }));

test('un pedido normal (8 productos con aclaración) entra holgado en el link', () => {
  const url = waLink('5492494440808', buildMessage({ ...base, mode: 'delivery', street: 'Rivadavia 123 2B', ref: 'portón negro', lines: many(8, 'sin cebolla'), notes: 'x'.repeat(100) }));
  assert.ok(url.length < 3000, 'largo ' + url.length);
});

test('un pedido de 25 productos largos supera MAX_WA_URL (la interfaz ofrece copiar)', () => {
  const url = waLink('5492494440808', buildMessage({ ...base, lines: many(25, 'aclaración larga de prueba '.repeat(3)), notes: 'x'.repeat(500) }));
  assert.ok(url.length > MAX_WA_URL, 'largo ' + url.length);
});

test('id de pedido con formato y sin caracteres ambiguos', () => {
  const id = newOrderId(new Date(2026, 9, 23), () => 0.5);
  assert.match(id, /^CP-2310-[A-Z2-9]{3}$/);
  assert.ok(!/[01OI]/.test(id.slice(8)));
});

const ok = { lineCount: 2, mode: 'retiro', name: 'Ana', phone: '249 444-0808', street: '', whenOk: true, payment: 'Efectivo', paymentOptions: ['Efectivo', 'Transferencia'], cashWith: null, subtotal: 30000, minOrder: null };

test('pedido válido sin errores', () => assert.deepEqual(validate(ok), {}));
test('valida carrito vacío, nombre, teléfono, horario y pago', () => {
  const e = validate({ ...ok, lineCount: 0, name: ' ', phone: '12', whenOk: false, payment: '' });
  assert.deepEqual(Object.keys(e).sort(), ['lines', 'name', 'payment', 'phone', 'when']);
});
test('delivery exige dirección', () => {
  assert.ok(validate({ ...ok, mode: 'delivery', street: 'Sol' }).street);
  assert.equal(validate({ ...ok, mode: 'delivery', street: 'Rivadavia 123' }).street, undefined);
});
test('retiro no exige dirección', () => assert.equal(validate({ ...ok, street: '' }).street, undefined));
test('medio de pago debe ser de la lista', () => assert.ok(validate({ ...ok, payment: 'Bitcoin' }).payment));
test('pedido mínimo de delivery', () => {
  const e = validate({ ...ok, mode: 'delivery', street: 'Rivadavia 123', minOrder: 40000, subtotal: 30000 });
  assert.ok(e.min.includes('$10.000'));
  assert.equal(validate({ ...ok, minOrder: 40000, subtotal: 30000 }).min, undefined);
});
test('formato de dinero argentino', () => assert.equal(money(1234567), '$1.234.567'));

test('productos agotados bloquean el envío con un mensaje claro', () => {
  const e = validate({ ...ok, soldOutNames: ['Milanesa XL', 'Flan casero'] });
  assert.ok(e.soldout.includes('Milanesa XL, Flan casero'));
  assert.equal(validate({ ...ok, soldOutNames: [] }).soldout, undefined);
  assert.equal(validate(ok).soldout, undefined);
});
