import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const browser = await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'qa');
for (const [name,url,viewport] of [
  ['reference-home-desktop-hero','https://fereacafe.framer.website/',{width:1440,height:900}],
  ['reference-home-mobile-hero','https://fereacafe.framer.website/',{width:390,height:844}],
  ['home-desktop-hero','http://127.0.0.1:5173/',{width:1440,height:900}],
  ['home-mobile-hero','http://127.0.0.1:5173/',{width:390,height:844}],
]) {
  const page=await browser.newPage({viewport,deviceScaleFactor:1,reducedMotion:'reduce'});
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
  await page.evaluate(async()=>{await document.fonts.ready});
  await page.waitForTimeout(900);
  await page.screenshot({path:join(out,`${name}.png`),animations:'disabled'});
  console.log(name);
  await page.close();
}
await browser.close();
