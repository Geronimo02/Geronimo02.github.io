// Miniaturas redondas para "Tu mesa" (el pedido visto desde arriba) y para el plato que vuela al carrito.
// Salida: public/mesa/*.webp (200 px, desde src/assets/fotos) y public/mesa/*.svg (ilustraciones provisorias).
// Uso: node scripts/prepare-mesa.mjs
import sharp from 'sharp';
import { mkdir, readdir, copyFile } from 'node:fs/promises';

const OUT = 'public/mesa';
await mkdir(OUT, { recursive: true });

for (const f of await readdir('src/assets/fotos')) {
  if (!/\.(jpe?g|png|webp)$/i.test(f)) continue;
  const name = f.replace(/\.\w+$/, '');
  await sharp(`src/assets/fotos/${f}`).resize(200, 200, { fit: 'cover', position: sharp.strategy.attention }).webp({ quality: 74 }).toFile(`${OUT}/${name}.webp`);
}
for (const f of await readdir('src/assets/recortes')) {
  if (f.endsWith('.svg')) await copyFile(`src/assets/recortes/${f}`, `${OUT}/${f}`);
}
console.log('Miniaturas en', OUT);
