const { test } = require('node:test');
const assert = require('node:assert/strict');
const { buildOrderMessage, buildWhatsAppUrl, validateOrder } = require('./checkout.js');

test('el mensaje incluye el pedido y los datos de entrega sin precios no confirmados', () => {
  const message = buildOrderMessage({
    customerName: 'Ana',
    fulfillment: 'delivery',
    address: 'Av. Santamarina 54',
    notes: 'Sin aceitunas',
    items: [
      { name: 'Pizza clásica', quantity: 2 },
      { name: 'Empanada tradicional', quantity: 3 }
    ]
  });

  assert.match(message, /2 × Pizza clásica/);
  assert.match(message, /3 × Empanada tradicional/);
  assert.match(message, /Ana/);
  assert.match(message, /Delivery/);
  assert.match(message, /Av\. Santamarina 54/);
  assert.match(message, /Sin aceitunas/);
  assert.match(message, /confirmar.*precio/i);
  assert.doesNotMatch(message, /\$|12\.000|2\.300/);
});

test('delivery exige dirección y todo pedido exige nombre y productos', () => {
  const errors = validateOrder({ customerName: ' ', fulfillment: 'delivery', address: '', items: [] });
  assert.ok(errors.customerName);
  assert.ok(errors.address);
  assert.ok(errors.items);
  assert.equal(validateOrder({ customerName: 'Ana', fulfillment: 'pickup', address: '', items: [{ name: 'Pizza', quantity: 1 }] }).address, undefined);
});

test('el enlace de WhatsApp conserva el mensaje y normaliza el número', () => {
  const url = new URL(buildWhatsAppUrl('+54 9 249 469 4718', 'Hola, quiero 2 pizzas.'));
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/5492494694718');
  assert.equal(url.searchParams.get('text'), 'Hola, quiero 2 pizzas.');
  assert.throws(() => buildWhatsAppUrl('', 'Hola'), /número/i);
});
