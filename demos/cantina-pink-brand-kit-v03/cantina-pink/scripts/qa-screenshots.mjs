// Uso: node scripts/qa-screenshots.mjs <fase> [url-base] [rutas separadas por coma]
// Ej:  node scripts/qa-screenshots.mjs fase-1 http://localhost:4321 /,/sistema
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const [phase = 'manual', base = 'http://localhost:4321', routesArg = '/'] = process.argv.slice(2);
const routes = routesArg.split(',');
const widths = [390, 768, 1024, 1440];
const outDir = `qa/${phase}`;
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const report = [];

for (const route of routes) {
  for (const width of widths) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && !m.location().url.includes('/api/') && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(base + route, { waitUntil: 'networkidle' });
    // Recorre la página para disparar reveals y lazy-load antes de capturar.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 500));
    });
    const overflow = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const offenders = [...document.querySelectorAll('body *')]
        .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.right > vw + 1 || r.left < -1); })
        .filter((el) => !el.closest('[data-allow-overflow], .visually-hidden, [hidden]'))
        .slice(0, 5)
        .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`);
      return { scrollWidth: document.documentElement.scrollWidth, vw, offenders };
    });
    const name = (route === '/' ? 'inicio' : route.replace(/^\/|\/$/g, '').replace(/\//g, '_')) + `-${width}.png`;
    await page.screenshot({ path: `${outDir}/${name}`, fullPage: true });
    let axe = [];
    if (width === 390 || width === 1440) {
      const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      axe = res.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, sample: v.nodes[0]?.target?.join(' ') }));
    }
    report.push({ route, width, file: name, horizontalOverflow: overflow.scrollWidth > overflow.vw, offenders: overflow.offenders, consoleErrors: errors, axe });
    await ctx.close();
  }
}
await browser.close();
await writeFile(`${outDir}/report.json`, JSON.stringify(report, null, 2));

for (const r of report) {
  const flags = [
    r.horizontalOverflow ? `DESBORDE (${r.offenders.join(', ')})` : '',
    r.consoleErrors.length ? `${r.consoleErrors.length} errores consola` : '',
    r.axe.length ? `axe: ${r.axe.map((a) => `${a.id}×${a.nodes}`).join(', ')}` : '',
  ].filter(Boolean).join(' · ');
  console.log(`${r.route.padEnd(18)} ${String(r.width).padEnd(5)} ${flags || 'OK'}`);
}
