import { chromium } from 'playwright-core';

const browser = await chromium.launch({headless: true, executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
const root = 'http://127.0.0.1:5173';
const results = [];
try {
  for (const width of [320, 390, 768, 1024, 1440]) {
    const page = await browser.newPage({viewport: {width, height: 900}});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(root, {waitUntil: 'domcontentloaded'});
    await page.locator('.hero h1').waitFor();
    await page.waitForTimeout(1600);
    const initial = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - innerWidth,
      heroColor: getComputedStyle(document.querySelector('.hero h1')).color,
      stripColor: getComputedStyle(document.querySelector('.hero-tilt')).backgroundColor,
      storyOpacity: getComputedStyle(document.querySelector('.story-heading')).opacity,
    }));
    await page.locator('.story-heading').scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    const storyOpacity = await page.locator('.story-heading').evaluate(element => getComputedStyle(element).opacity);
    await page.locator('.featured-list').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.getByRole('button', {name: 'Ver siguiente destacado'}).click();
    await page.waitForTimeout(500);
    const carouselScroll = await page.locator('.featured-list').evaluate(element => element.scrollLeft);
    if (width <= 760) {
      await page.getByRole('button', {name: 'Abrir menú'}).click();
      await page.waitForTimeout(500);
      if (!await page.getByRole('navigation', {name: 'Navegación móvil'}).isVisible()) errors.push('mobile menu not visible');
    }
    results.push({width, ...initial, storyAfterScroll: storyOpacity, carouselScroll, errors});
    if (width === 1440 || width === 390) {
      await page.goto(root, {waitUntil: 'domcontentloaded'});
      await page.waitForTimeout(1600);
      await page.screenshot({path: `qa/green-home-${width}.png`, animations: 'disabled'});
    }
    await page.close();
  }
  const reduced = await browser.newPage({viewport: {width: 390, height: 844}, reducedMotion: 'reduce'});
  await reduced.goto(root, {waitUntil: 'domcontentloaded'});
  await reduced.waitForTimeout(350);
  results.push({reducedMotionStoryOpacity: await reduced.locator('.story-heading').evaluate(element => getComputedStyle(element).opacity)});
  await reduced.close();
  console.log(JSON.stringify(results, null, 2));
} finally { await browser.close(); }
