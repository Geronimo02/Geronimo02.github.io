import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'qa');
await mkdir(out, {recursive:true});
const browser = await chromium.launch({headless:true, executablePath:edge});

async function capture(name, url, viewport, fullPage = false) {
  const page = await browser.newPage({viewport, deviceScaleFactor:1, reducedMotion:'reduce'});
  await page.goto(url, {waitUntil:'domcontentloaded', timeout:30000});
  await page.locator('body').waitFor();
  await page.evaluate(async () => { await document.fonts.ready; });
  if (fullPage) {
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += viewport.height * .85) {
      await page.evaluate(y => window.scrollTo(0,y), y);
      await page.waitForTimeout(80);
    }
    await page.evaluate(() => window.scrollTo(0,0));
  }
  await page.waitForTimeout(600);
  await page.screenshot({path:join(out,`${name}.png`),fullPage,animations:'disabled'});
  const dimensions = await page.evaluate(() => ({w:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight}));
  console.log(name, dimensions);
  await page.close();
}

try {
  await capture('reference-home-desktop', 'https://fereacafe.framer.website/', {width:1440,height:900}, true);
  await capture('reference-home-mobile', 'https://fereacafe.framer.website/', {width:390,height:844}, true);
  await capture('reference-menu-desktop', 'https://fereacafe.framer.website/menu', {width:1440,height:900});
  await capture('reference-about-desktop', 'https://fereacafe.framer.website/about', {width:1440,height:900});
  await capture('home-desktop', 'http://127.0.0.1:5173/', {width:1440,height:900}, true);
  await capture('home-mobile', 'http://127.0.0.1:5173/', {width:390,height:844}, true);
  await capture('carta-desktop', 'http://127.0.0.1:5173/carta/', {width:1440,height:900});
  await capture('carta-mobile', 'http://127.0.0.1:5173/carta/', {width:390,height:844});
} finally { await browser.close(); }
