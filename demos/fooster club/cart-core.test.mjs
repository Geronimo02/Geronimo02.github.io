import test from 'node:test';
import assert from 'node:assert/strict';
import { addLine, changeQuantity, getTotals, makeLineId, revalidateCart, buildWhatsAppMessage, whatsappUrl } from './cart-core.mjs';

const products = [
  { id: 'underground', name: 'Underground', priceArs: 12000, verified: true, available: true, orderingEnabled: true,
    modifiers: [{ id: 'extras', options: [{ id: 'cheddar', label: 'Extra cheddar', priceArs: 1500, verified: true, available: true }] }] },
  { id: 'papas', name: 'Papas clásicas', priceArs: 4000, verified: true, available: true, orderingEnabled: true, modifiers: [] },
];

test('identical lines combine, but differing extras and notes stay separate', () => {
  const plain = { productId: 'underground', quantity: 1, selectedOptions: [], note: '' };
  let cart = addLine([], plain);
  cart = addLine(cart, plain);
  cart = addLine(cart, { ...plain, selectedOptions: [{ optionId: 'cheddar', quantity: 1 }] });
  cart = addLine(cart, { ...plain, note: 'sin pepinillos' });
  assert.deepEqual(cart.map(line => line.quantity), [2, 1, 1]);
  assert.equal(new Set(cart.map(line => line.lineId)).size, 3);
});

test('extras are charged for each unit and quantities can remove a line', () => {
  const cart = addLine([], { productId: 'underground', quantity: 3, selectedOptions: [{ optionId: 'cheddar', quantity: 2 }], note: '' });
  assert.equal(getTotals(cart, products).total, 45000);
  assert.deepEqual(changeQuantity(cart, cart[0].lineId, 0), []);
});

test('old or unverified prices and modifiers invalidate saved cart', () => {
  const cart = addLine([], { productId: 'underground', quantity: 1, selectedOptions: [{ optionId: 'cheddar', quantity: 1 }], note: '' });
  assert.equal(revalidateCart(cart, products).length, 1);
  assert.equal(revalidateCart(cart, [{ ...products[0], priceArs: null }]).length, 0);
  assert.equal(revalidateCart(cart, [{ ...products[0], modifiers: [] }]).length, 0);
  assert.equal(revalidateCart([{ ...cart[0], quantity: -2 }], products).length, 0);
  assert.deepEqual(revalidateCart([cart[0], cart[0]], products).map(line => line.quantity), [2]);
});

test('WhatsApp message includes quantities, extras and notes; URL needs valid number', () => {
  const cart = addLine([], { productId: 'underground', quantity: 2, selectedOptions: [{ optionId: 'cheddar', quantity: 1 }], note: 'sin pepinillos' });
  const message = buildWhatsAppMessage(cart, products, { name: 'Ana', mode: 'Retiro en local', notes: 'Timbre 2' });
  assert.match(message, /2 x Underground/);
  assert.match(message, /Extra cheddar x1/);
  assert.match(message, /sin pepinillos/);
  assert.match(message, /\$27\.000/);
  assert.equal(whatsappUrl(null, message), null);
  assert.equal(whatsappUrl('54911XXXXXXXX', message), null);
  assert.match(whatsappUrl('5492494123456', message), /^https:\/\/wa\.me\/5492494123456\?text=/);
  assert.equal(makeLineId('underground', [], 'a'), makeLineId('underground', [], 'a'));
});
