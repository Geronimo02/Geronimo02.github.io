import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const photos = {
  'coffee-croissant': 'https://unsplash.com/photos/a-cup-of-coffee-and-a-croissant-on-a-table-RJCODpGceTQ',
  'coffee-table': 'https://unsplash.com/photos/a-cup-of-coffee-and-a-croissant-on-a-wooden-table-fCUHx-iVGBE',
  barista: 'https://unsplash.com/photos/barista-making-coffee-with-espresso-machine-d_n6V0RqpN0',
  'cafe-interior': 'https://unsplash.com/photos/a-cozy-stylish-interior-of-a-cafe-F4W6QYmUnDg',
  'coffee-pastry': 'https://unsplash.com/photos/latte-croissant-and-book-on-cafe-table-1k7TnX5GAww',
};

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images');
await mkdir(out, { recursive: true });
for (const [name, page] of Object.entries(photos)) {
  const html = await (await fetch(page)).text();
  const match = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/) ??
    html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/);
  if (!match) throw new Error(`No og:image: ${page}`);
  const raw = match[1].replaceAll('&amp;', '&');
  const url = new URL(raw);
  if (url.hostname !== 'images.unsplash.com') throw new Error(`Unexpected host: ${url.hostname}`);
  url.search = '?auto=format&fit=crop&w=1400&q=80';
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status}: ${name}`);
  const data = Buffer.from(await response.arrayBuffer());
  await writeFile(join(out, `${name}.jpg`), data);
  process.stdout.write(`${name}: ${data.length} bytes\n`);
}
