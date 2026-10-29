import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

await mkdir('qa/rebuild', {recursive: true});
const browser = await chromium.launch({headless: true, executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({viewport: {width, height: width === 1440 ? 900 : 844}});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:5173/', {waitUntil: 'domcontentloaded'});
    await page.evaluate(async () => document.fonts.ready);
    await page.waitForTimeout(1600);
    for (const [name, selector, offset] of [
      ['hero', '.nm-hero', 0],
      ['story', '.nm-story', 0],
      ['menu', '.nm-menu-showcase', 0],
      ['care-start', '.nm-care-track', 0],
      ['care-middle', '.nm-care-track', .5],
      ['care-end', '.nm-care-track', .95],
      ['place', '.nm-place', 0],
      ['cup', '.nm-cup-story', 0],
      ['pairing', '.nm-pairing', 0],
      ['moments', '.nm-moments', 0],
      ['journal', '.nm-journal', 0],
      ['faq', '.nm-faq', 0],
    ]) {
      const y = await page.locator(selector).evaluate((element, offset) => {
        const top = element.getBoundingClientRect().top + scrollY;
        return top + offset * Math.max(0, element.clientHeight - innerHeight);
      }, offset);
      await page.evaluate(y => scrollTo(0, y), y);
      await page.waitForTimeout(850);
      await page.screenshot({path: `qa/rebuild/${width}-${name}.png`});
    }
    const dimensions = await page.evaluate(() => ({width: innerWidth, scrollWidth: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight}));
    console.log(JSON.stringify({width, dimensions, errors}));
    await page.close();
  }
} finally { await browser.close(); }
