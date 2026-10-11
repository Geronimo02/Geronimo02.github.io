import test from 'node:test';
import assert from 'node:assert/strict';
import { config, products } from './data.mjs';
import { addLine, getTotals, revalidateCart } from './cart-core.mjs';

test('all demo products have fictitious prices while real ordering stays disabled', () => {
  assert.equal(config.demoOrderingEnabled, true);
  assert.equal(config.orderingLive, false);
  assert.equal(config.whatsappNumber, null);
  assert.equal(products.length, 28);
  assert.ok(products.every(product => Number.isSafeInteger(product.demoPriceArs) && product.demoPriceArs > 0));
  assert.ok(products.every(product => product.priceArs === null && !product.verified && !product.orderingEnabled));
});

test('the demo catalog supports cart quantities and totals without official prices', () => {
  const demoCatalog = products.map(product => ({
    ...product,
    priceArs: product.demoPriceArs,
    verified: true,
    available: true,
    orderingEnabled: true,
  }));
  const cart = addLine([], { productId: 'underground', quantity: 2 });
  assert.equal(revalidateCart(cart, demoCatalog).length, 1);
  assert.deepEqual(getTotals(cart, demoCatalog), {
    productsTotal: 29000,
    extrasTotal: 0,
    total: 29000,
    count: 2,
    valid: true,
  });
  assert.equal(revalidateCart(cart, products).length, 0);
});
