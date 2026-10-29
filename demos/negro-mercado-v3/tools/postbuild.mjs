// Hosting estático: cada ruta necesita su propio index.html (y /mesa/1..40 para los QR de la demo).
import { mkdir, copyFile } from 'node:fs/promises';
const routes = ['carta', 'productos', 'pedido', 'panel', ...Array.from({ length: 40 }, (_, i) => `mesa/${i + 1}`)];
for (const route of routes) {
  await mkdir(new URL(`../dist/${route}/`, import.meta.url), { recursive: true });
  await copyFile(new URL('../dist/index.html', import.meta.url), new URL(`../dist/${route}/index.html`, import.meta.url));
}
await copyFile(new URL('../dist/index.html', import.meta.url), new URL('../dist/404.html', import.meta.url));
