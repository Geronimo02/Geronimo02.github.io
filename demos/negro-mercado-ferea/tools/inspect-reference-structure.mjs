import { chromium } from 'playwright-core';

const browser = await chromium.launch({headless: true, executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
try {
  for (const [label, url, width, height] of [
    ['reference-desktop', 'https://fereacafe.framer.website/', 1440, 900],
    ['reference-mobile', 'https://fereacafe.framer.website/', 390, 844],
    ['ours-desktop', 'http://127.0.0.1:5173/', 1440, 900],
  ]) {
    const page = await browser.newPage({viewport: {width, height}, reducedMotion: 'reduce'});
    await page.goto(url, {waitUntil: 'domcontentloaded'});
    await page.evaluate(async () => document.fonts.ready);
    const data = await page.evaluate(() => ({
      height: document.documentElement.scrollHeight,
      headings: [...document.querySelectorAll('h1,h2,h3')].filter(el => {
        const box = el.getBoundingClientRect();
        return box.width > 40 && box.height > 20;
      }).map(el => ({text: el.textContent.trim().slice(0, 90), y: Math.round(el.getBoundingClientRect().top + scrollY), h: Math.round(el.getBoundingClientRect().height), size: getComputedStyle(el).fontSize})).slice(0, 70),
    }));
    console.log(JSON.stringify({label, ...data}));
    await page.close();
  }
} finally { await browser.close(); }
