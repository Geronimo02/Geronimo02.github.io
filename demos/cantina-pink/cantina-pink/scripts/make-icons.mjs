// Íconos del sitio desde la rosa (propuesta C). Uso: node scripts/make-icons.mjs
import sharp from 'sharp';
import { readFileSync, copyFileSync } from 'node:fs';

const svg = readFileSync('public/logo/cantina-pink-c-rosa.svg');
const bg = { r: 255, g: 247, b: 233, alpha: 1 };
copyFileSync('public/logo/cantina-pink-c-rosa.svg', 'public/favicon.svg');
await sharp(svg, { density: 600 }).resize(32, 32).png().toFile('public/favicon-32.png');
await sharp(svg, { density: 600 }).resize(150, 150).extend({ top: 15, bottom: 15, left: 15, right: 15, background: bg }).flatten({ background: bg }).png().toFile('public/apple-touch-icon.png');
await sharp(svg, { density: 600 }).resize(192, 192).png().toFile('public/icon-192.png');
console.log('Íconos generados en public/');
