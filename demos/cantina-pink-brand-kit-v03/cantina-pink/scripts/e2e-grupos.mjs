// Prueba de punta a punta del formulario /grupos. No envía nada. Uso: node scripts/e2e-grupos.mjs [url-base]
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';

const base = process.argv[2] ?? 'http://localhost:4321';
let passed = 0;
const ok = (n) => { passed++; console.log('  ok  ', n); };
const browser = await chromium.launch();

for (const [w, h, label] of [[1440, 900, 'escritorio'], [390, 844, 'celular']]) {
  console.log(`Grupos (${label})`);
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  // /api/menu no existe en la vista previa estática (sin funciones): la web sigue con la carta base.
  page.on('console', (m) => m.type() === 'error' && !m.location().url.includes('/api/') && errors.push(m.text()));
  const waUrls = [];
  await ctx.route('https://wa.me/**', (r) => { waUrls.push(r.request().url()); r.fulfill({ status: 200, contentType: 'text/html', body: '<title>wa.me</title>' }); });
  await page.goto(base + '/grupos', { waitUntil: 'networkidle' });
  await page.waitForSelector('#g-name');

  assert.equal(await page.locator('#g-time').isDisabled(), true);
  ok('la hora está deshabilitada hasta elegir el día');

  await page.getByRole('button', { name: 'Enviar consulta por WhatsApp' }).click();
  await page.waitForFunction(() => document.activeElement?.id === 'g-name', null, { timeout: 2000 });
  const txt = await page.locator('.grupo').innerText();
  for (const t of ['nombre', 'teléfono válido', 'Elegí un día', 'Elegí la ocasión']) assert.ok(txt.includes(t), 'falta: ' + t);
  assert.equal(waUrls.length, 0);
  ok('enviar vacío marca los errores, enfoca el nombre y no abre WhatsApp');

  const minus = page.getByRole('button', { name: 'Una persona menos' });
  for (let i = 0; i < 10; i++) if (await minus.isEnabled()) await minus.click();
  assert.equal((await page.locator('#g-people output').innerText()).trim(), '2');
  assert.equal(await minus.isDisabled(), true);
  ok('el selector de personas no baja de 2');

  await page.getByRole('button', { name: 'Una persona más' }).click();
  await page.fill('#g-name', 'Ana López');
  await page.fill('#g-phone', '249 444 0808');
  const d = new Date(Date.now() + 3 * 86400e3);
  const ymd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  await page.fill('#g-date', ymd);
  await page.waitForFunction(() => document.querySelectorAll('#g-time option').length > 2, null, { timeout: 2000 });
  const opts = await page.locator('#g-time option').allInnerTexts();
  assert.ok(opts.includes('A coordinar') && opts.some((o) => /^\d\d:\d\d h$/.test(o)));
  ok('al elegir el día aparecen horarios dentro del horario del local y "A coordinar"');

  await page.selectOption('#g-time', { index: 2 });
  await page.selectOption('#g-occasion', 'Cumpleaños');
  await page.getByLabel('Pizza libre').check();
  await page.getByLabel('Milanesas XL para compartir').check();
  await page.getByPlaceholder(/celíacos/).fill('2 celíacos');
  await page.getByPlaceholder(/torta/).fill('Llevamos torta');

  const prev = await page.locator('.preview').evaluate((el) => { el.open = true; return el.querySelector('pre').innerText; });
  for (const f of ['CONSULTA DE MESA PARA GRUPO - CANTINA PINK', 'Nombre: Ana López', 'Somos: 3 personas', 'Ocasión: Cumpleaños', '- Pizza libre', '- Milanesas XL para compartir', '2 celíacos', 'Llevamos torta', 'no una reserva confirmada']) {
    assert.ok(prev.includes(f), 'la vista previa no incluye: ' + f + '\n' + prev);
  }
  ok('la vista previa arma la consulta completa');

  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  assert.deepEqual(axe.violations.map((v) => v.id + ' ' + v.nodes[0].target.join(' ')), []);
  ok('el formulario no tiene problemas de accesibilidad (axe)');

  await page.getByRole('button', { name: 'Copiar consulta' }).click();
  await page.waitForTimeout(300);
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  assert.ok(clip.includes('Ana López') && clip.includes('Somos: 3 personas'));
  ok('"Copiar consulta" deja el mensaje en el portapapeles');

  const hasWa = !(await page.locator('.grupo').innerText()).includes('Todavía no está cargado el WhatsApp');
  await page.getByRole('button', { name: 'Enviar consulta por WhatsApp' }).click();
  await page.waitForTimeout(300);
  if (hasWa) { assert.equal(waUrls.length, 1); assert.ok(decodeURIComponent(waUrls[0].split('text=')[1]).includes('Ana López')); ok('enviar abre wa.me con la consulta'); }
  else { assert.equal(waUrls.length, 0); assert.ok(await page.locator('.sent').isVisible()); ok('sin número cargado: avisa y ofrece copiar o llamar'); }

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  assert.equal(overflow, false);
  ok('sin desborde horizontal');
  await page.screenshot({ path: `qa/fase-3b/grupos-${w}.png`, fullPage: true });
  assert.deepEqual(errors, [], errors.join(' | '));
  ok('sin errores de consola');
  await ctx.close();
}
await browser.close();
console.log(`\n${passed} comprobaciones OK`);
