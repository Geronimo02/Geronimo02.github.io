// Prueba de punta a punta del panel /admin contra "wrangler pages dev" (necesita las funciones y un KV).
// Levantar antes:  npx wrangler pages dev dist --kv=CARTA --binding=ADMIN_PASSWORD=prueba-local-123 --port 8788
// Uso: node scripts/e2e-admin.mjs [url-base] [contraseña]
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';

const base = process.argv[2] ?? 'http://127.0.0.1:8788';
const PASS = process.argv[3] ?? 'prueba-local-123';
let passed = 0;
const ok = (n) => { passed++; console.log('  ok  ', n); };

const reset = async () => {
  const r = await fetch(base + '/api/admin/menu', { method: 'PUT', headers: { authorization: 'Bearer ' + PASS }, body: JSON.stringify({ prices: {}, soldOut: [], promo: null }) });
  assert.equal(r.status, 200);
};
await reset();

const pad = (n) => String(n).padStart(2, '0');
const stamp = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
const from = stamp(new Date(Date.now() - 24 * 3600e3));
const to = stamp(new Date(Date.now() + 30 * 24 * 3600e3));

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && !/Failed to load resource.*(400|401|404)/.test(m.text()) && errors.push(m.text()));

console.log('Panel /admin');
await page.goto(base + '/admin', { waitUntil: 'networkidle' });
await page.getByLabel('Contraseña').fill('incorrecta');
await page.getByRole('button', { name: 'Entrar' }).click();
await page.waitForSelector('#adm-err');
assert.ok((await page.locator('#adm-err').innerText()).includes('no es correcta'));
assert.equal(await page.locator('.adm-card').count(), 0);
ok('contraseña incorrecta: muestra el error y no abre el editor');

await page.getByLabel('Contraseña').fill(PASS);
await page.getByRole('button', { name: 'Entrar' }).click();
await page.waitForSelector('.adm-card');
ok('contraseña correcta: abre el editor');

assert.equal(await page.getByRole('button', { name: 'Guardar cambios' }).isDisabled(), true);
ok('sin cambios el botón guardar está deshabilitado');

await page.getByLabel('Precio de hoy de Muzzarella').fill('17000');
await page.getByLabel('Precio de hoy de Muzzarella').evaluate((el) => el.value);
await page.getByLabel('Agotado (Milanesa XL para compartir)').check();
await page.getByLabel('Mostrar esta promo en la web').check();
await page.getByLabel(/Título/).fill('Martes de pizza');
await page.getByLabel(/Texto \(hasta/).fill('Pedí una pizza y llevate una gaseosa de 1 L.');
await page.getByLabel('Empieza').fill(from);
await page.getByLabel('Termina').fill(to);
assert.ok((await page.locator('.adm-bar-msg').innerText()).includes('sin guardar'));
ok('cargar cambios activa el aviso "sin guardar"');

const a11y = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
assert.deepEqual(a11y.violations.map((v) => v.id + ' ' + v.nodes[0].target.join(' ')), []);
ok('el editor no tiene problemas de accesibilidad (axe)');

await page.getByRole('button', { name: 'Guardar cambios' }).click();
await page.waitForSelector('.adm-status--ok');
assert.ok((await page.locator('.adm-status').innerText()).includes('Guardado'));
assert.equal(await page.getByRole('button', { name: 'Guardar cambios' }).isDisabled(), true);
ok('guardar confirma y vuelve a "todo guardado"');

const api = await (await fetch(base + '/api/menu')).json();
assert.equal(api.prices['pizza-muzzarella'], 17000);
assert.deepEqual(api.soldOut, ['milanesa-xl']);
assert.equal(api.promo.title, 'Martes de pizza');
ok('el servidor guardó precio, agotado y promo');

await page.getByLabel('Precio de hoy de Especial').fill('0');
await page.getByRole('button', { name: 'Guardar cambios' }).click();
await page.waitForSelector('.adm-status--err');
assert.ok((await page.locator('.adm-status').innerText()).includes('inválid'));
ok('un precio inválido se rechaza con un mensaje claro');
await page.getByRole('button', { name: 'Descartar' }).click();
assert.equal(await page.getByLabel('Precio de hoy de Especial').inputValue(), '');
ok('descartar vuelve al último estado guardado');

await page.reload({ waitUntil: 'networkidle' });
await page.waitForSelector('.adm-card');
assert.equal(await page.getByLabel('Precio de hoy de Muzzarella').inputValue(), '17000');
ok('al recargar la sesión sigue abierta y los datos se conservan');

console.log('Sitio público con los cambios');
const pub = await ctx.newPage();
pub.on('pageerror', (e) => errors.push(e.message));
await pub.goto(base + '/carta', { waitUntil: 'networkidle' });
await pub.waitForFunction(() => document.querySelector('[data-price-text="pizza-muzzarella"]')?.textContent === '$17.000', null, { timeout: 5000 });
assert.equal(await pub.locator('[data-price-note="pizza-muzzarella"]').isHidden(), true);
ok('/carta muestra el precio nuevo y oculta el "precio de ejemplo"');

assert.ok(await pub.locator('[data-soldout-for="milanesa-xl"]').isVisible());
assert.ok((await pub.locator('[data-add="milanesa-xl"]').innerText()).includes('Agotado'));
assert.equal(await pub.locator('[data-add="milanesa-xl"] [data-act="add"]').count(), 0);
ok('/carta marca "Agotado por hoy" y reemplaza el botón de agregar');

await pub.locator('[data-add="pizza-muzzarella"] [data-act="add"]').click();
await pub.locator('[data-add="pizza-muzzarella"] [data-act="inc"]').click();
await pub.waitForSelector('.cart-panel .line');
assert.ok((await pub.locator('.cart-panel').innerText()).includes('$34.000'));
ok('el pedido calcula con el precio nuevo (2 × $17.000 = $34.000)');

await pub.evaluate(() => {
  const s = JSON.parse(localStorage.getItem('cp-cart-v1'));
  s.lines.push({ id: 'milanesa-xl', qty: 1 });
  localStorage.setItem('cp-cart-v1', JSON.stringify(s));
});
await pub.reload({ waitUntil: 'networkidle' });
await pub.waitForSelector('.cart-panel .line');
await pub.waitForFunction(() => document.querySelector('.line-sold'), null, { timeout: 5000 });
await pub.getByRole('button', { name: /Enviar pedido por WhatsApp/ }).click();
assert.ok((await pub.locator('.cart-panel').innerText()).includes('Se agotó por hoy: Milanesa XL'));
ok('un producto agotado que ya estaba en el pedido se marca y bloquea el envío');

await pub.goto(base + '/mesa', { waitUntil: 'networkidle' });
await pub.waitForFunction(() => document.querySelector('[data-price-text="pizza-muzzarella"]')?.textContent === '$17.000', null, { timeout: 5000 });
assert.ok(await pub.locator('[data-soldout-for="milanesa-xl"]').isVisible());
ok('/mesa (la carta del QR) también refleja precio y agotado');

await pub.goto(base + '/', { waitUntil: 'networkidle' });
await pub.waitForSelector('[data-promo]:not([hidden])', { timeout: 5000 });
assert.ok((await pub.locator('[data-promo]').innerText()).includes('Martes de pizza'));
assert.equal(await pub.locator('[data-promo-cta]').getAttribute('href'), '/carta');
ok('el inicio muestra la promo cargada desde el panel');

await pub.locator('[data-promo-close]').click();
assert.equal(await pub.locator('[data-promo]').isHidden(), true);
ok('la promo se puede cerrar');

await reset();
// /api/menu se guarda 20 s en cada navegador; un navegador limpio ve el cambio de inmediato.
const fresh = await (await browser.newContext()).newPage();
await fresh.goto(base + '/carta', { waitUntil: 'networkidle' });
await fresh.waitForTimeout(600);
assert.equal(await fresh.locator('[data-price-text="pizza-muzzarella"]').innerText(), '$16.500');
ok('al borrar los cambios vuelve la carta original');

assert.deepEqual(errors, [], 'errores de consola: ' + errors.join(' | '));
ok('sin errores de consola');

await browser.close();
console.log(`\n${passed} comprobaciones OK`);
