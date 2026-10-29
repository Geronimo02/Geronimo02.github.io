// QR de las mesas. Uso: SITE_URL=https://tu-dominio npm run qr
// Genera public/qr/mesa-qr.svg (vectorial, ideal para imprenta) y mesa-qr.png (3000 px, ~25 cm a 300 dpi).
import QRCode from 'qrcode';
import { mkdir, writeFile } from 'node:fs/promises';

const site = (process.env.SITE_URL ?? 'https://cantina-pink.pages.dev').replace(/\/$/, '');
const url = `${site}/mesa?ref=qr`;
const opts = { errorCorrectionLevel: 'H', margin: 4, color: { dark: '#3B1719', light: '#FFFFFF' } };

await mkdir('public/qr', { recursive: true });
await writeFile('public/qr/mesa-qr.svg', await QRCode.toString(url, { ...opts, type: 'svg' }));
await QRCode.toFile('public/qr/mesa-qr.png', url, { ...opts, width: 3000 });
console.log('QR generado para', url);
