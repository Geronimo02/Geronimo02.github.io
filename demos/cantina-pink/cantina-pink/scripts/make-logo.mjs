// Propuestas de logo en vector (REINTERPRETACIONES, no el logo oficial) para comparar con el original.
// Salida: public/logo/*.svg. Las tipografías se convierten a trazos, así los SVG no dependen de fuentes instaladas.
// Uso: node scripts/make-logo.mjs
import opentype from 'opentype.js';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';

const load = (p) => { const b = readFileSync(p); return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)); };
const RYE = load('node_modules/@fontsource/rye/files/rye-latin-400-normal.woff');
const SLAB = load('node_modules/@fontsource/alfa-slab-one/files/alfa-slab-one-latin-400-normal.woff');

const C = { red: '#B1252C', redHi: '#CF343A', wine: '#741F25', ink: '#3B1719', blue: '#2D4F9B', green: '#2E7D43', leaf: '#5E8B4A', cream: '#F6EBD3', paper: '#E8D8BF', gold: '#F2C14E', creamLight: '#FFF7E9' };
const r1 = (n) => Math.round(n * 10) / 10;

/** Texto como trazo, ajustado a un ancho y centrado en (cx, cy). */
function word(font, text, width, cx, cy, id) {
  // El trazo se genera siempre a un tamaño fijo y se escala con transform: opentype.js devuelve NaN en algunos tamaños sueltos.
  const U = 1000;
  const path = font.getPath(text, 0, 0, U);
  const bb0 = path.getBoundingBox();
  const k = width / (bb0.x2 - bb0.x1);
  const tx = cx - ((bb0.x1 + bb0.x2) / 2) * k;
  const ty = cy - ((bb0.y1 + bb0.y2) / 2) * k;
  const d = path.toPathData(1);
  if (/NaN/.test(d)) throw new Error('Trazo inválido (NaN) en "' + text + '"');
  return { id, d, k, tf: `translate(${r1(tx)} ${r1(ty)}) scale(${k.toFixed(5)})`, bb: { x1: bb0.x1 * k + tx, x2: bb0.x2 * k + tx, y1: bb0.y1 * k + ty, y2: bb0.y2 * k + ty } };
}

const rose = (cx, cy, s) => `<g transform="translate(${cx} ${cy}) scale(${s})">
  <ellipse cx="-14" cy="9" rx="8.5" ry="3.6" transform="rotate(-28 -14 9)" fill="#3E7B3F" stroke="#14301A" stroke-width="1.2"/>
  <ellipse cx="14" cy="9" rx="8.5" ry="3.6" transform="rotate(28 14 9)" fill="#3E7B3F" stroke="#14301A" stroke-width="1.2"/>
  <circle r="13.5" fill="${C.red}" stroke="${C.ink}" stroke-width="1.6"/>
  <g fill="${C.redHi}" stroke="${C.ink}" stroke-width="1.1">
    <circle cx="0" cy="-8" r="6.2"/><circle cx="7.6" cy="-2.5" r="6.2"/><circle cx="4.7" cy="6.5" r="6.2"/><circle cx="-4.7" cy="6.5" r="6.2"/><circle cx="-7.6" cy="-2.5" r="6.2"/>
  </g>
  <circle r="6.4" fill="#8E1C24" stroke="${C.ink}" stroke-width="1"/>
  <path d="M0 -4 C 4 -4 5 1 1 2.2 C -2.5 3 -3.6 -1 -0.6 -1.6" fill="none" stroke="${C.cream}" stroke-width="1.3" stroke-linecap="round"/>
</g>`;

/** Fileteado: dos volutas a cada lado de la rosa. */
const flourish = (cx, cy, span, color, w = 3) => {
  const side = `M ${cx - 24} ${cy} C ${cx - 44} ${cy - 2}, ${cx - 58} ${cy + 12}, ${cx - 84} ${cy + 3} C ${cx - 104} ${cy - 4}, ${cx - 112} ${cy - 18}, ${cx - 98} ${cy - 22} C ${cx - 86} ${cy - 24}, ${cx - 82} ${cy - 10}, ${cx - 92} ${cy - 9}
    M ${cx - 84} ${cy + 3} C ${cx - 100} ${cy + 18}, ${cx - span} ${cy + 16}, ${cx - span - 6} ${cy + 4}`;
  return `<g fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">
    <path d="${side}"/><path d="${side}" transform="translate(${cx * 2} 0) scale(-1 1)"/></g>
    <g fill="${color}"><circle cx="${cx - 60}" cy="${cy - 8}" r="2.4"/><circle cx="${cx + 60}" cy="${cy - 8}" r="2.4"/></g>`;
};

/** Cartel con volutas: contorno verde con esquinas curvas y el centro de arriba y abajo levantado. */
const FRAME = 'M 74 62 C 74 42, 132 46, 172 54 C 216 62, 252 36, 300 36 C 348 36, 384 62, 428 54 C 468 46, 526 42, 526 62 C 526 82, 546 90, 546 122 L 546 232 C 546 262, 526 272, 526 304 C 526 336, 468 332, 428 324 C 384 316, 348 342, 300 342 C 252 342, 216 316, 172 324 C 132 332, 74 336, 74 304 C 74 272, 54 262, 54 232 L 54 122 C 54 90, 74 82, 74 62 Z';

function wordLayers(w, { fill, outline, shadow, sw = 7, off = 4 }) {
  const s = r1(sw / w.k * 10) / 10;
  // El trazo de la palabra se define una sola vez y se reutiliza para sombra, contorno y relleno.
  return `<defs><path id="${w.id}" d="${w.d}"/></defs>
  <use href="#${w.id}" transform="translate(${off} ${off}) ${w.tf}" fill="${shadow}" stroke="${shadow}" stroke-width="${s}" stroke-linejoin="round"/>
  <use href="#${w.id}" transform="${w.tf}" fill="${outline}" stroke="${outline}" stroke-width="${s}" stroke-linejoin="round"/>
  <use href="#${w.id}" transform="${w.tf}" fill="${fill}"/>`;
}

function bulbs(w, rows, id) {
  const { x1, x2, y1, y2 } = w.bb;
  const cy = (y1 + y2) / 2;
  const dots = [];
  for (const dy of rows) for (let x = x1 + 14; x < x2 - 6; x += 21) dots.push(`<circle cx="${r1(x)}" cy="${r1(cy + dy)}" r="3.2" fill="${C.gold}" stroke="#7A4B10" stroke-width=".9"/>`);
  return `<clipPath id="${id}"><use href="#${w.id}" transform="${w.tf}"/></clipPath><g clip-path="url(#${id})">${dots.join('')}</g>`;
}

const grad = (id, hi, lo) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hi}"/><stop offset="1" stop-color="${lo}"/></linearGradient>`;

const svg = (vb, body, title) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`;

// ---------- A: fiel, en vector ----------
function logoA() {
  const can = word(RYE, 'CANTINA', 366, 300, 128, 'wc');
  const pink = word(SLAB, 'PINK', 352, 300, 232, 'wp');
  return svg('0 0 600 380', `
  <defs>${grad('gA', C.redHi, '#8E1C24')}${grad('gB', C.redHi, '#86191F')}</defs>
  <path d="${FRAME}" fill="${C.cream}" stroke="${C.green}" stroke-width="9" stroke-linejoin="round"/>
  <path d="${FRAME}" fill="none" stroke="${C.green}" stroke-width="2.4" transform="translate(300 189) scale(.935) translate(-300 -189)" opacity=".85"/>
  ${wordLayers(can, { fill: 'url(#gA)', outline: C.ink, shadow: C.blue })}
  ${wordLayers(pink, { fill: 'url(#gB)', outline: C.ink, shadow: C.blue, sw: 8 })}
  ${bulbs(pink, [-2], 'bulbsA')}
  ${flourish(300, 316, 168, C.leaf)}
  ${rose(300, 316, 1.05)}`, 'Cantina Pink (propuesta A, fiel en vector)');
}

// ---------- B: simplificada, dos colores, para tamaños chicos ----------
function logoB(dark) {
  const ink = dark ? C.creamLight : C.wine;
  const shadow = dark ? '#1E0A0C' : C.red;
  const can = word(RYE, 'CANTINA', 330, 280, 84, 'wc');
  const pink = word(SLAB, 'PINK', 360, 280, 182, 'wp');
  return svg('0 0 560 300', `
  ${wordLayers(can, { fill: ink, outline: ink, shadow, sw: 1.2, off: 3.5 })}
  ${wordLayers(pink, { fill: ink, outline: ink, shadow, sw: 1.2, off: 4.5 })}
  ${bulbs(pink, [-2], dark ? 'bulbsBd' : 'bulbsBl')}
  ${flourish(280, 262, 150, dark ? C.creamLight : C.leaf, 3.2)}
  ${rose(280, 262, 1)}`, `Cantina Pink (propuesta B, simplificada, ${dark ? 'sobre fondo oscuro' : 'sobre fondo claro'})`);
}

// ---------- C: solo la rosa, como sello ----------
function logoC() {
  return svg('0 0 200 200', `
  <circle cx="100" cy="100" r="94" fill="${C.cream}" stroke="${C.green}" stroke-width="8"/>
  <circle cx="100" cy="100" r="82" fill="none" stroke="${C.green}" stroke-width="2" stroke-dasharray="1 7" stroke-linecap="round"/>
  ${rose(100, 104, 4.9)}`, 'Cantina Pink (propuesta C, rosa como sello)');
}

mkdirSync('public/logo', { recursive: true });
const files = {
  'cantina-pink-a-fiel.svg': logoA(),
  'cantina-pink-b-simple-claro.svg': logoB(false),
  'cantina-pink-b-simple-oscuro.svg': logoB(true),
  'cantina-pink-c-rosa.svg': logoC(),
};
for (const [name, content] of Object.entries(files)) writeFileSync(`public/logo/${name}`, content);
console.log('Generados:', Object.keys(files).join(', '));
