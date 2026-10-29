// Capturas del scroll escénico "poner la mesa" en distintos puntos del recorrido.
// Uso: node scripts/qa-scroll.mjs <fase> [url-base]
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const [phase = 'manual', base = 'http://localhost:4321'] = process.argv.slice(2);
const out = `qa/${phase}/scroll`;
await mkdir(out, { recursive: true });
const browser = await chromium.launch();

for (const [w, h] of [[390, 844], [1440, 900]]) {
  for (const reduced of [false, true]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: reduced ? 'reduce' : 'no-preference' });
    const page = await ctx.newPage();
    await page.goto(base + '/', { waitUntil: 'networkidle' });
    const steps = reduced ? [1] : [0, 0.25, 0.5, 0.75, 1];
    for (const p of steps) {
      await page.evaluate((p) => {
        const s = document.querySelector('[data-pm]');
        const top = s.getBoundingClientRect().top + scrollY;
        scrollTo(0, top + (s.offsetHeight - innerHeight) * p);
      }, p);
      await page.waitForTimeout(1400);
      await page.screenshot({ path: `${out}/mesa-${w}${reduced ? '-reduced' : ''}-${Math.round(p * 100)}.png` });
    }
    await ctx.close();
  }
}
await browser.close();
console.log('Capturas en', out);
