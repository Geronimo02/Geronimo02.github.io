// Hoja rápida de comparación: original vs. propuestas, solo para revisar el dibujo. Uso: node scripts/logo-preview.mjs [salida.png]
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const out = process.argv[2] ?? 'qa/logo-ensayo.png';
const names = ['cantina-pink-a-fiel', 'cantina-pink-b-simple-claro', 'cantina-pink-b-simple-oscuro', 'cantina-pink-c-rosa'];
const orig = 'data:image/jpeg;base64,' + readFileSync('src/assets/logo/cantina-pink-logo.jpg').toString('base64');
const url = (n) => 'data:image/svg+xml;base64,' + readFileSync(`public/logo/${n}.svg`).toString('base64');
const cell = (label, src, dark) => `<div style="${dark ? 'background:#741F25;color:#fff;' : ''}padding:10px"><p style="margin:0 0 6px">${label}</p><img src="${src}" width="420"></div>`;
const html = `<body style="margin:0;background:#FFF7E9;font:14px sans-serif"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:8px">
${cell('ORIGINAL', orig, false)}${names.map((n) => cell(n, url(n), n.includes('oscuro'))).join('')}</div></body>`;

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1400, height: 760 } });
await p.setContent(html);
await p.waitForTimeout(600);
await p.screenshot({ path: out });
await b.close();
console.log('Hoja en', out);
