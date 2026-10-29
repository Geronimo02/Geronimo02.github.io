// Recorta las fotos originales de assets/ (sin logos ni textos pegados) y las deja en src/assets/fotos/.
// Uso: node scripts/prepare-photos.mjs   (los originales NO se modifican)
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const src = (id) => `assets/SaveInta.com_${id}_n.jpg`;
const OUT = 'src/assets/fotos';
await mkdir(OUT, { recursive: true });

// region = { left, top, width, height } en píxeles del original; maxW limita el ancho final.
const jobs = [
  // Pizzas (originales 1440x1800 con logo abajo)
  { id: '504634840_18157605298368791_526187918806494367', out: 'pizza-jamon-rucula', region: { left: 0, top: 0, width: 1440, height: 1420 }, maxW: 1400 },
  { id: '506037560_18157605289368791_3109999828728859857', out: 'pizza-jamon-mano', region: { left: 0, top: 0, width: 1440, height: 1420 }, maxW: 1400 },
  // Milanesas (originales grandes, sin textos)
  { id: '708967482_18195155023368791_3481928465287955737', out: 'milanesa-caballo', maxW: 1600 },
  { id: '710468946_18195155014368791_3918680075333087872', out: 'mesa-milanesas', maxW: 1600 },
  // Piezas con promo: solo la mitad de abajo (foto), sin texto de promo ni logo
  { id: '731417559_18198857305368791_335784764291289653', out: 'pizza-huevos', region: { left: 0, top: 575, width: 1080, height: 560 }, maxW: 1400 },
  { id: '731462212_18198857314368791_8748833868213372316', out: 'empanada-salsa', region: { left: 0, top: 610, width: 1080, height: 520 }, maxW: 1400 },
  // Secuencia "pasta en pan": cuadrados sobre el plato, antes del texto y logo de abajo
  { id: '747625307_18200077702368791_8685825111857305057', out: 'pasta-1-vacio', region: { left: 40, top: 90, width: 1000, height: 1000 }, maxW: 1000 },
  { id: '743852217_18200077660368791_8430061215024935649', out: 'pasta-2-pasta', region: { left: 40, top: 90, width: 1000, height: 1000 }, maxW: 1000 },
  { id: '745019815_18200077687368791_642398043039737320', out: 'pasta-3-salsa', region: { left: 40, top: 90, width: 1000, height: 1000 }, maxW: 1000 },
  { id: '746256929_18200077678368791_2975886861820919432', out: 'pasta-4-queso', region: { left: 40, top: 90, width: 1000, height: 1000 }, maxW: 1000 },
  { id: '748044156_18200077690368791_4306727063773948972', out: 'pasta-5-montana', region: { left: 40, top: 70, width: 1000, height: 1000 }, maxW: 1000 },
];

for (const j of jobs) {
  let img = sharp(src(j.id)).rotate();
  if (j.region) img = img.extract(j.region);
  await img.resize({ width: j.maxW, withoutEnlargement: true }).jpeg({ quality: 86, mozjpeg: true }).toFile(`${OUT}/${j.out}.jpg`);
  console.log('ok', j.out);
}
