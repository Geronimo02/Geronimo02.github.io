// Accesibilidad (axe, WCAG 2.1 AA) del carrito en sus estados reales. Uso: node scripts/a11y-carrito.mjs [url-base]
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const base = process.argv[2] ?? 'http://localhost:4321';
const b = await chromium.launch();
let bad = 0;
const check = async (page, label) => {
  const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  if (r.violations.length) { bad++; console.log('FALLA', label); r.violations.forEach((v) => console.log('   ', v.id, v.impact, v.nodes.length, v.nodes[0].target.join(' '), '\n      ', v.nodes[0].failureSummary?.split('\n')[1])); }
  else console.log('ok   ', label);
};
const open = new Date('2026-10-23T00:30:00Z');
for (const [w, h, label] of [[1440, 900, 'escritorio'], [390, 844, 'celular']]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  await p.clock.setFixedTime(open);
  await p.goto(base + '/carta', { waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  for (const id of ['pizza-muzzarella', 'milanesa-xl']) await p.locator(`[data-add="${id}"] [data-act]`).first().click();
  await check(p, `${label}: carta con productos`);
  if (w < 960) { await p.locator('.cart-bar').click(); await p.waitForSelector('dialog[open]'); await p.waitForTimeout(600); }
  await check(p, `${label}: pedido abierto`);
  await p.getByLabel(/Delivery/).check();
  await p.getByRole('button', { name: /Enviar pedido por WhatsApp/ }).click();
  await p.waitForTimeout(300);
  await check(p, `${label}: delivery con errores de validación`);
  await p.fill('#f-name', 'Ana'); await p.fill('#f-phone', '249 444 0808'); await p.fill('#f-street', 'Rivadavia 123');
  await p.selectOption('#f-when', { index: 1 }); await p.getByLabel('Efectivo').check();
  await p.getByRole('button', { name: 'Copiar pedido' }).click();
  await p.waitForTimeout(300);
  await check(p, `${label}: pedido completo y confirmación`);
  await ctx.close();
}
await b.close();
process.exit(bad ? 1 : 0);
