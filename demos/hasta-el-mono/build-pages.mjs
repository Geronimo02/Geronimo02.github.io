import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteDir = dirname(fileURLToPath(import.meta.url));
const outputDir = join(siteDir, 'dist');
const files = ['index.html', 'styles.css', 'app.js', 'checkout.js', 'robots.txt', '_headers'];

if (dirname(outputDir) !== siteDir) {
  throw new Error('Invalid Pages output path');
}

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

for (const file of files) {
  await cp(join(siteDir, file), join(outputDir, file));
}
await cp(join(siteDir, 'assets'), join(outputDir, 'assets'), { recursive: true });

console.log(`Pages output ready: ${outputDir}`);
