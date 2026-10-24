import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeOverrides, parsePublicOverrides, safeHref, EMPTY_OVERRIDES } from '../src/lib/carta-store.ts';

const ids = new Set(['pizza-muzzarella', 'milanesa-xl', 'flan']);
const NOW = new Date('2026-10-23T12:00:00Z');

test('acepta precios enteros de productos existentes y agotados', () => {
  const r = sanitizeOverrides({ prices: { 'pizza-muzzarella': 17000 }, soldOut: ['milanesa-xl', 'milanesa-xl'] }, ids, NOW);
  assert.ok(r.ok);
  assert.deepEqual(r.value.prices, { 'pizza-muzzarella': 17000 });
  assert.deepEqual(r.value.soldOut, ['milanesa-xl']);
  assert.equal(r.value.updatedAt, NOW.toISOString());
  assert.equal(r.value.promo, null);
});

test('precio vacío o null significa "volver al precio original"', () => {
  const r = sanitizeOverrides({ prices: { 'pizza-muzzarella': null, flan: '' } }, ids, NOW);
  assert.ok(r.ok);
  assert.deepEqual(r.value.prices, {});
});

test('rechaza productos desconocidos', () => {
  assert.equal(sanitizeOverrides({ prices: { hackeado: 1 } }, ids, NOW).ok, false);
  assert.equal(sanitizeOverrides({ soldOut: ['hackeado'] }, ids, NOW).ok, false);
});

test('rechaza precios inválidos', () => {
  for (const bad of [0, -5, 1.5, NaN, Infinity, 2_000_001, '17000', true, {}, []]) {
    assert.equal(sanitizeOverrides({ prices: { flan: bad } }, ids, NOW).ok, false, 'debería rechazar ' + JSON.stringify(bad));
  }
});

test('rechaza cuerpos que no son objetos', () => {
  for (const bad of [null, 'x', 5, [], undefined]) assert.equal(sanitizeOverrides(bad, ids, NOW).ok, false);
});

test('rechaza estructuras equivocadas', () => {
  assert.equal(sanitizeOverrides({ prices: [] }, ids, NOW).ok, false);
  assert.equal(sanitizeOverrides({ soldOut: 'flan' }, ids, NOW).ok, false);
  assert.equal(sanitizeOverrides({ promo: 'x' }, ids, NOW).ok, false);
});

test('no se cuela __proto__ ni claves raras', () => {
  const r = sanitizeOverrides(JSON.parse('{"prices":{"__proto__":5,"flan":9000}}'), ids, NOW);
  assert.equal(r.ok, false);
  assert.equal(({}).polluted, undefined);
});

const promo = { active: true, title: 'Martes de pizza', text: 'Pedí una y llevate una gaseosa', startsAt: '2026-10-27T12:00', endsAt: '2026-10-27T23:59', ctaLabel: 'Pedir', ctaHref: '/carta' };

test('promo válida', () => {
  const r = sanitizeOverrides({ promo }, ids, NOW);
  assert.ok(r.ok);
  assert.equal(r.value.promo.title, 'Martes de pizza');
});

test('promo activa exige título y fechas coherentes', () => {
  assert.equal(sanitizeOverrides({ promo: { ...promo, title: '' } }, ids, NOW).ok, false);
  assert.equal(sanitizeOverrides({ promo: { ...promo, startsAt: 'mañana' } }, ids, NOW).ok, false);
  assert.equal(sanitizeOverrides({ promo: { ...promo, endsAt: '2026-10-26T10:00' } }, ids, NOW).ok, false);
});

test('promo inactiva puede guardarse incompleta (borrador)', () => {
  assert.ok(sanitizeOverrides({ promo: { active: false, title: 'Borrador' } }, ids, NOW).ok);
});

test('enlaces peligrosos se rechazan', () => {
  for (const href of ['javascript:alert(1)', 'data:text/html,x', '//evil.com', 'http://insegura.com', 'ftp://x']) {
    assert.equal(sanitizeOverrides({ promo: { ...promo, ctaHref: href } }, ids, NOW).ok, false, href);
    assert.equal(safeHref(href), '', href);
  }
  assert.equal(safeHref('/carta#pedido'), '/carta#pedido');
  assert.equal(safeHref('https://wa.me/549'), 'https://wa.me/549');
});

test('los textos se limpian y se recortan', () => {
  const r = sanitizeOverrides({ promo: { ...promo, title: 'A'.repeat(200), text: 'línea\u0000uno\ndos' } }, ids, NOW);
  assert.ok(r.ok);
  assert.equal(r.value.promo.title.length, 60);
  assert.equal(r.value.promo.text, 'línea uno dos');
});

test('lo que llega del servidor se vuelve a validar en el navegador', () => {
  assert.deepEqual(parsePublicOverrides(null), EMPTY_OVERRIDES);
  assert.deepEqual(parsePublicOverrides('x'), EMPTY_OVERRIDES);
  const o = parsePublicOverrides({ prices: { a: 100, b: -1, c: 'x', d: 1.5 }, soldOut: ['a', 5, null], promo: { active: true, title: 'T', ctaHref: 'javascript:1' } });
  assert.deepEqual(o.prices, { a: 100 });
  assert.deepEqual(o.soldOut, ['a']);
  assert.equal(o.promo.ctaHref, '');
});
