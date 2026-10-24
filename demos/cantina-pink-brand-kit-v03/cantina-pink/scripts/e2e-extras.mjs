// "Tu mesa" (platos del pedido), plato que vuela y medidor de queso. Uso: node scripts/e2e-extras.mjs [url-base]
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';

const base = process.argv[2] ?? 'http://127.0.0.1:8788';
let passed = 0;
const ok = (n) => { passed++; console.log('  ok  ', n); };
const browser = await chromium.launch();
const OPEN = new Date('2026-10-23T00:30:00Z');
const noApi = (m) => m.type() === 'error' && !m.location().url.includes('/api/');

async function fresh(viewport, opts = {}) {
  const ctx = await browser.newContext({ viewport, ...opts });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => noApi(m) && errors.push(m.text()));
  await page.clock.setFixedTime(OPEN);
  return { ctx, page, errors };
}

console.log('Tu mesa (escritorio)');
{
  const { ctx, page, errors } = await fresh({ width: 1440, height: 900 });
  await page.goto(base + '/carta', { waitUntil: 'networkidle' });
  await page.waitForSelector('.mesa-table');
  assert.ok((await page.locator('.mesa-empty').innerText()).includes('vacía'));
  ok('con el pedido vacío la mesa lo dice');

  const add = (id) => page.locator(`[data-add="${id}"] [data-act="add"], [data-add="${id}"] [data-act="inc"]`).first().click();
  await add('pizza-muzzarella');
  assert.ok(await page.locator('.fly-plate').count() >= 1);
  ok('al tocar "Agregar" sale volando un plato');
  await page.waitForFunction(() => document.querySelectorAll('.fly-plate').length === 0, null, { timeout: 3000 });
  ok('el plato volador desaparece al llegar');

  await add('pizza-muzzarella');
  await add('milanesa-xl');
  await page.waitForFunction(() => document.querySelectorAll('.mesa-table .plate-sm').length === 3, null, { timeout: 3000 });
  ok('cada unidad del pedido es un plato en la mesa (2 + 1 = 3)');

  const imgs = await page.locator('.mesa-table .plate-sm img').evaluateAll((els) => els.map((e) => e.getAttribute('src')));
  assert.ok(imgs.every((s) => s.startsWith('/mesa/')), imgs.join());
  assert.ok(imgs.some((s) => s.endsWith('.svg')) && imgs.some((s) => s.endsWith('.webp')));
  ok('usa foto real cuando hay y ilustración de la categoría cuando no');

  const sizes = await page.locator('.mesa-table .plate-sm').first().evaluate((e) => e.getBoundingClientRect().width);
  assert.ok(sizes >= 86 && sizes <= 96, 'tamaño ' + sizes);
  ok('con pocos platos se ven grandes');

  for (let i = 0; i < 20; i++) await add('empanada-carne');
  await page.waitForFunction(() => document.querySelectorAll('.mesa-table .plate-sm').length === 16, null, { timeout: 4000 });
  assert.ok((await page.locator('.mesa-count').innerText()).includes('+'));
  ok('tope de 16 platos y el resto se resume en "+N más"');

  const tableBox = await page.locator('.mesa-table').boundingBox();
  const plateBoxes = await page.locator('.mesa-table .plate-sm').evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); return [r.left, r.right, r.top, r.bottom]; }));
  const t = await page.locator('.mesa-table').evaluate((e) => { const r = e.getBoundingClientRect(); return [r.left, r.right, r.top, r.bottom]; });
  assert.ok(plateBoxes.every(([l, r]) => l >= t[0] - 2 && r <= t[1] + 2), 'un plato se sale de la mesa');
  ok('todos los platos entran dentro de la mesa');
  void tableBox;

  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  assert.deepEqual(axe.violations.map((v) => v.id + ' ' + v.nodes[0].target.join(' ')), []);
  ok('accesibilidad (axe) con la mesa llena');

  assert.deepEqual(errors, [], errors.join(' | '));
  await page.screenshot({ path: 'qa/fase-3c/mesa-1440.png' });
  await ctx.close();
}

console.log('Tu mesa (celular y movimiento reducido)');
{
  const { ctx, page, errors } = await fresh({ width: 390, height: 844 });
  await page.goto(base + '/carta', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.locator('[data-add="pizza-especial"] [data-act="add"]').click();
  assert.ok(await page.locator('.fly-plate').count() >= 1);
  await page.waitForSelector('.cart-bar');
  await page.locator('.cart-bar').click();
  await page.waitForSelector('dialog[open] .mesa-table');
  await page.waitForTimeout(900);
  assert.equal(await page.locator('dialog[open] .mesa-table .plate-sm').count(), 1);
  ok('en celular el plato vuela hacia la barra y la mesa aparece en el pedido');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  assert.equal(overflow, false);
  await page.screenshot({ path: 'qa/fase-3c/mesa-390.png' });
  assert.deepEqual(errors, [], errors.join(' | '));
  await ctx.close();

  const r = await fresh({ width: 1440, height: 900 }, { reducedMotion: 'reduce' });
  await r.page.goto(base + '/carta', { waitUntil: 'networkidle' });
  await r.page.waitForSelector('.mesa-table');
  await r.page.locator('[data-add="pizza-muzzarella"] [data-act="add"]').click();
  await r.page.waitForTimeout(150);
  assert.equal(await r.page.locator('.fly-plate').count(), 0);
  await r.page.waitForFunction(() => document.querySelectorAll('.mesa-table .plate-sm').length === 1);
  ok('con movimiento reducido no vuela nada, pero el plato aparece en la mesa');
  await r.ctx.close();
}

console.log('Medidor de queso');
for (const [w, h, label] of [[1440, 900, 'escritorio'], [390, 844, 'celular']]) {
  const { ctx, page, errors } = await fresh({ width: w, height: h });
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.locator('[data-queso]').scrollIntoViewIfNeeded();
  const range = page.locator('#queso-range');
  const op = (sel) => page.locator(sel).evaluate((e) => Number(e.style.opacity));
  assert.equal((await page.locator('[data-queso-verdict]').innerText()).trim(), 'Como corresponde.');
  ok(`${label}: arranca en "como corresponde"`);

  await range.fill('0');
  assert.equal(await op('[data-queso-l1]'), 0);
  assert.equal(await page.locator('[data-queso-g]').innerText(), '0');
  assert.ok((await page.locator('[data-queso-verdict]').innerText()).includes('Sin queso'));
  ok(`${label}: sin queso se ve la salsa y 0 g`);

  await range.fill('100');
  assert.equal(await op('[data-queso-l2]'), 1);
  assert.equal(await page.locator('[data-queso-g]').innerText(), '300');
  assert.ok((await page.locator('[data-queso-verdict]').innerText()).includes('NO. Bueno'));
  assert.ok(await page.locator('[data-queso-stamp].is-on').isVisible());
  ok(`${label}: al máximo aparece la montaña, 300 g y el sello "Demasiado queso"`);

  await range.fill('70');
  assert.equal(await page.locator('[data-queso-stamp].is-on').count(), 0);
  assert.ok((await page.locator('[data-queso-verdict]').innerText()).includes('mano'));
  ok(`${label}: el sello se va al bajar`);

  await range.focus();
  await page.keyboard.press('Home');
  assert.equal(await range.inputValue(), '0');
  await page.keyboard.press('End');
  assert.equal(await range.inputValue(), '100');
  ok(`${label}: se maneja con teclado (Inicio / Fin)`);

  const axe = await new AxeBuilder({ page }).include('[data-queso]').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  assert.deepEqual(axe.violations.map((v) => v.id + ' ' + v.nodes[0].target.join(' ')), []);
  ok(`${label}: accesibilidad (axe)`);

  await range.fill('85');
  await page.locator('[data-queso]').screenshot({ path: `qa/fase-3c/queso-${w}.png` });
  assert.deepEqual(errors, [], errors.join(' | '));
  await ctx.close();
}

await browser.close();
console.log(`\n${passed} comprobaciones OK`);
