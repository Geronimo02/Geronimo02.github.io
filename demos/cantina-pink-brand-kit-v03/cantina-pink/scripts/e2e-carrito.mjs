// Prueba de punta a punta del carrito con WhatsApp. No envía nada: el link de wa.me se intercepta.
// Uso: node scripts/e2e-carrito.mjs [url-base]
// Para probar el envío real del link, buildear con un número de prueba en business.json (whatsapp.e164).
import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base = process.argv[2] ?? 'http://localhost:4321';
const OPEN_AT = new Date('2026-10-23T00:30:00Z');   // jueves 23/10 21:30 en Argentina: abierto
const CLOSED_AT = new Date('2026-10-23T18:00:00Z'); // jueves 23/10 15:00 en Argentina: cerrado entre turnos
let passed = 0;
const ok = (name) => { passed++; console.log('  ok  ', name); };

const browser = await chromium.launch();

async function newPage(viewport, at = OPEN_AT) {
  const ctx = await browser.newContext({ viewport, permissions: ['clipboard-read', 'clipboard-write'] });
  const opened = [];
  const waUrls = [];
  await ctx.route('https://wa.me/**', (r) => { waUrls.push(r.request().url()); r.fulfill({ status: 200, contentType: 'text/html', body: '<title>wa.me (simulado)</title>' }); });
  const page = await ctx.newPage();
  ctx.on('page', (p) => opened.push(p));
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && !m.text().includes('ERR_FAILED') && errors.push(m.text()));
  await page.clock.setFixedTime(at);
  return { ctx, page, opened, errors, waUrls };
}

const add = async (page, id, times = 1) => {
  for (let i = 0; i < times; i++) await page.locator(`[data-add="${id}"] [data-act="add"], [data-add="${id}"] [data-act="inc"]`).first().click();
};

// ---------- ESCRITORIO ----------
{
  console.log('Escritorio (1440)');
  const { ctx, page, opened, errors, waUrls } = await newPage({ width: 1440, height: 900 });
  await page.goto(base + '/carta', { waitUntil: 'networkidle' });
  await page.waitForSelector('.cart-panel');

  assert.ok((await page.locator('.empty').innerText()).includes('Todavía no hay nada'));
  ok('carrito vacío muestra el estado vacío');

  assert.equal(await page.locator('[data-add="pizza-libre"]').count(), 0);
  assert.equal(await page.locator('[data-add="pasta-libre"]').count(), 0);
  assert.equal(await page.locator('[data-add="vino-tinto"]').count(), 0);
  ok('lo que es "solo en el local" no tiene botón de agregar');

  await add(page, 'pizza-muzzarella', 2);
  await add(page, 'milanesa-xl');
  assert.equal((await page.locator('[data-add="pizza-muzzarella"] output').innerText()).trim(), '2');
  assert.ok((await page.locator('.cart-panel').innerText()).includes('$61.500'));
  assert.equal((await page.locator('[data-cart-count]').first().innerText()).trim(), '3');
  ok('agregar suma cantidades, subtotal $61.500 y el contador del encabezado');

  await page.locator('[data-add="pizza-muzzarella"] [data-act="dec"]').click();
  assert.ok((await page.locator('.cart-panel').innerText()).includes('$45.000'));
  await page.locator('.cart-panel .line', { hasText: 'Milanesa XL' }).getByRole('button', { name: /Quitar/ }).click();
  assert.equal(await page.locator('.cart-panel .line').count(), 1);
  assert.equal(await page.locator('[data-add="milanesa-xl"] [data-act="add"]').count(), 1);
  ok('quitar desde el panel actualiza también los botones de la carta');
  await add(page, 'milanesa-xl');

  const waBtn = page.getByRole('button', { name: /Enviar pedido por WhatsApp/ });
  await waBtn.click();
  assert.ok(await page.locator('.err--box').isVisible());
  for (const t of ['tu nombre', 'teléfono válido', 'día y la hora de retiro', 'cómo vas a pagar']) {
    assert.ok((await page.locator('.cart-panel').innerText()).includes(t), 'falta error: ' + t);
  }
  await page.waitForFunction(() => document.activeElement?.id === 'f-name', null, { timeout: 2000 });
  assert.equal(waUrls.length, 0);
  ok('enviar con datos faltantes muestra los errores, enfoca el primero y no abre WhatsApp');

  await page.fill('#f-name', 'Juan Pérez');
  await page.fill('#f-phone', '249 123-4567');
  const hours = await page.locator('#f-when option').allInnerTexts();
  assert.ok(hours.length > 1);
  await page.selectOption('#f-when', { index: 1 });
  await page.getByLabel('Efectivo').check();
  await page.fill('#f-cash', '70000');
  await page.locator('.line-note summary').first().click();
  await page.locator('.line-note input').first().fill('sin aceitunas');
  await page.fill('textarea', 'Traer cubiertos');
  ok('se completan retiro, datos, pago, aclaración de línea y aclaraciones generales');

  const preview = await page.locator('.preview').evaluate((d) => { d.open = true; return d.querySelector('pre').innerText; });
  for (const f of ['PEDIDO WEB - CANTINA PINK', 'Nombre: Juan Pérez', 'RETIRO EN EL LOCAL', 'San Martín 501', 'Aclaración: sin aceitunas', 'Productos: 2', 'Subtotal: $45.000', '*TOTAL: $45.000*', 'Efectivo (se abona al retirar)', 'vuelto $25.000', 'Traer cubiertos']) {
    assert.ok(preview.includes(f), 'la vista previa no incluye: ' + f + '\n' + preview);
  }
  ok('la vista previa muestra el mensaje completo, con vuelto');

  const hasWa = !(await page.locator('.pending', { hasText: 'COMPLETAR' }).count() && (await page.locator('.cart-panel').innerText()).includes('Todavía no está cargado el WhatsApp'));
  await waBtn.click();
  if (hasWa) {
    await page.waitForTimeout(400);
    assert.equal(waUrls.length, 1);
    const url = waUrls[0];
    assert.ok(url.startsWith('https://wa.me/'), url);
    const text = decodeURIComponent(url.split('text=')[1]);
    assert.ok(text.includes('Nombre: Juan Pérez') && text.includes('*TOTAL: $45.000*'));
    ok('enviar abre wa.me con el mensaje completo codificado');
  } else {
    assert.equal(waUrls.length, 0);
    assert.ok(await page.locator('.sent').isVisible());
    ok('sin número de WhatsApp cargado: no abre nada y avisa que falta el número');
  }

  await page.getByRole('button', { name: 'Copiar pedido' }).click();
  await page.waitForTimeout(200);
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  assert.ok(clip.includes('PEDIDO WEB - CANTINA PINK') && clip.includes('Juan Pérez'));
  ok('"Copiar pedido" deja el mensaje en el portapapeles');

  // Delivery
  await page.getByLabel(/Delivery/).check();
  assert.equal(await page.locator('#f-street').count(), 1);
  assert.equal(await page.getByLabel('Efectivo').isChecked(), false, 'al cambiar de modalidad se limpia el pago');
  await page.getByLabel('Transferencia').check();
  await page.selectOption('#f-when', { index: 1 }).catch(() => {});
  await page.getByRole('button', { name: /Enviar pedido por WhatsApp/ }).click();
  assert.ok((await page.locator('.cart-panel').innerText()).includes('calle, número'));
  await page.fill('#f-street', 'Rivadavia 123, 2° B');
  await page.fill('#f-ref', 'Portón negro');
  await page.waitForFunction(() => document.querySelector('.preview pre')?.innerText.includes('Referencias: Portón negro'), null, { timeout: 3000 });
  const prev2 = await page.locator('.preview pre').innerText();
  for (const f of ['MODALIDAD: DELIVERY', 'Dirección: Rivadavia 123, 2° B', 'Referencias: Portón negro', 'Envío: a confirmar', '*TOTAL (sin envío): $45.000*', 'se abona al recibir']) {
    assert.ok(prev2.includes(f), 'delivery sin: ' + f + '\n' + prev2);
  }
  ok('delivery exige dirección y el mensaje incluye dirección, referencias y envío a confirmar');

  // Persistencia
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('.cart-panel .line');
  assert.equal(await page.inputValue('#f-name'), 'Juan Pérez');
  assert.equal(await page.inputValue('#f-street'), 'Rivadavia 123, 2° B');
  assert.equal((await page.locator('[data-add="milanesa-xl"] output').innerText()).trim(), '1');
  ok('al recargar se conservan el pedido y los datos');

  // Lo antes posible con el local abierto
  assert.equal(await page.getByLabel(/Lo antes posible/).isDisabled(), false);
  ok('con el local abierto se puede pedir "lo antes posible"');

  await page.getByRole('button', { name: 'Vaciar pedido' }).last().click();
  assert.ok((await page.locator('.empty').innerText()).includes('Todavía no hay nada'));
  assert.equal(await page.inputValue('#f-name').catch(() => 'sin-form'), 'sin-form');
  ok('vaciar pedido limpia el carrito');

  assert.deepEqual(errors, [], 'errores de consola: ' + errors.join(' | '));
  ok('sin errores de consola');
  await ctx.close();
}

// ---------- LOCAL CERRADO ----------
{
  console.log('Local cerrado (15:00)');
  const { ctx, page, errors } = await newPage({ width: 1440, height: 900 }, CLOSED_AT);
  await page.goto(base + '/carta', { waitUntil: 'networkidle' });
  await page.waitForSelector('.cart-panel');
  await add(page, 'pizza-muzzarella');
  assert.ok((await page.locator('.banner').innerText()).includes('Ahora estamos cerrados'));
  assert.equal(await page.getByLabel(/Lo antes posible/).isDisabled(), true);
  ok('cerrado: aviso visible y "lo antes posible" deshabilitado');
  const first = await page.locator('#f-when option').nth(1).innerText();
  assert.ok(/^\d\d:\d\d h$/.test(first));
  ok('se pueden elegir turnos programados');
  assert.deepEqual(errors, []);
  await ctx.close();
}

// ---------- CELULAR ----------
{
  console.log('Celular (390)');
  const { ctx, page, errors } = await newPage({ width: 390, height: 844 });
  await page.goto(base + '/carta', { waitUntil: 'networkidle' });
  await page.waitForSelector('.cart-skeleton, .cart-bar, dialog', { state: 'attached' });
  assert.equal(await page.locator('.cart-bar').count(), 0);
  ok('sin productos no hay barra de pedido');

  await add(page, 'pizza-muzzarella', 2);
  await page.waitForSelector('.cart-bar');
  const bar = await page.locator('.cart-bar').innerText();
  assert.ok(bar.includes('2') && bar.includes('$33.000'), bar);
  ok('con productos aparece la barra fija con cantidad y subtotal');

  await page.locator('.cart-bar').click();
  await page.waitForSelector('dialog[open]');
  assert.ok(await page.locator('dialog[open] .pedido').isVisible());
  ok('la barra abre el pedido en pantalla completa');

  await page.keyboard.press('Escape');
  await page.waitForSelector('dialog:not([open])', { state: 'attached' });
  ok('Escape cierra el pedido');

  await page.locator('[data-cart-link]').first().click();
  await page.waitForSelector('dialog[open]');
  assert.ok(page.url().endsWith('/carta') || page.url().includes('/carta'));
  ok('el botón "Pedir" del encabezado abre el pedido sin salir de la carta');

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  assert.equal(overflow, false);
  ok('sin desborde horizontal con el pedido abierto');

  await page.screenshot({ path: 'qa/fase-3/pedido-390-abierto.png' });
  assert.deepEqual(errors, [], 'errores: ' + errors.join(' | '));
  await ctx.close();
}

await browser.close();
console.log(`\n${passed} comprobaciones OK`);
