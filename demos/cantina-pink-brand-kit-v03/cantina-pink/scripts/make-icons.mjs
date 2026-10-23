// Íconos desde el logo original, sin retoques: solo redimensionado sobre su propio fondo beige.
import sharp from 'sharp';

const src = 'src/assets/logo/cantina-pink-logo.jpg';
await sharp(src).resize(32, 32).png().toFile('public/favicon-32.png');
await sharp(src).resize(180, 180, { kernel: 'lanczos3' }).png().toFile('public/apple-touch-icon.png');
await sharp(src).resize(192, 192, { kernel: 'lanczos3' }).png().toFile('public/icon-192.png');
console.log('Íconos generados en public/');
