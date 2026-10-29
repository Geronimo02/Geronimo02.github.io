import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

await mkdir('qa/reference-motion', {recursive: true});
const browser = await chromium.launch({headless: true, executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
try {
  const page = await browser.newPage({viewport: {width: 1440, height: 900}});
  await page.goto('https://fereacafe.framer.website/', {waitUntil: 'domcontentloaded'});
  await page.waitForTimeout(1500);
  for (const y of [0, 900, 1800, 2700, 3700, 4400, 5000, 5600, 6200, 6900, 7600, 8500, 9300, 10300, 11500, 13000, 14500]) {
    await page.evaluate(y => scrollTo(0, y), y);
    await page.waitForTimeout(850);
    await page.screenshot({path: `qa/reference-motion/scroll-${y}.png`});
    const motions = await page.evaluate(() => [...document.querySelectorAll('[style*="transform"]')].filter(el => {const r = el.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0 && r.width > 100 && r.height > 100;}).slice(0,5).map(el => ({text: el.textContent.trim().slice(0,40), top: Math.round(el.getBoundingClientRect().top), transform: getComputedStyle(el).transform})));
    console.log(JSON.stringify({y, motions}));
  }
  await page.close();

  const mobile = await browser.newPage({viewport: {width: 390, height: 844}});
  await mobile.goto('https://fereacafe.framer.website/', {waitUntil: 'domcontentloaded'});
  await mobile.waitForTimeout(1600);
  const buttons = await mobile.locator('button').evaluateAll(els => els.slice(0,8).map(el => ({text: el.textContent.trim().slice(0,40), aria: el.getAttribute('aria-label'), className: String(el.className).slice(0,60)})));
  console.log(JSON.stringify({mobileButtons: buttons}));
  await mobile.screenshot({path: 'qa/reference-motion/mobile-initial.png'});
  const menu = mobile.locator('[aria-label*="menu" i], [aria-label*="navigation" i]').first();
  if (await menu.count()) {
    await menu.click();
    await mobile.waitForTimeout(500);
    await mobile.screenshot({path: 'qa/reference-motion/mobile-menu.png'});
  }
  await mobile.close();
} finally { await browser.close(); }
