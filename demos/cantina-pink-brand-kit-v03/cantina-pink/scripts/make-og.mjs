// Genera public/og.png desde /og-image. Requiere el sitio corriendo (npm run dev o preview).
// Uso: node scripts/make-og.mjs [url-base]
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:4321';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(`${base}/og-image`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.locator('.og').screenshot({ path: 'public/og.png' });
await browser.close();
console.log('public/og.png generado');
