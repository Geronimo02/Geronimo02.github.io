import { chromium } from 'playwright-core';

const browser = await chromium.launch({headless: true, executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
const root = 'http://127.0.0.1:5173';
const results = [];
try {
  for (const width of [320, 375, 390, 768, 1024, 1280, 1440]) {
    const page = await browser.newPage({viewport: {width, height: 900}});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(root, {waitUntil: 'domcontentloaded'});
    await page.waitForTimeout(1000);
    const first = await page.evaluate(() => ({overflow: document.documentElement.scrollWidth - innerWidth, heroVisible: getComputedStyle(document.querySelector('.nm-hero h1')).opacity}));
    const track = page.locator('.nm-care-track');
    const middle = await track.evaluate(element => element.getBoundingClientRect().top + scrollY + (element.clientHeight - innerHeight) * .5);
    await page.evaluate(y => scrollTo(0,y), middle);
    await page.waitForTimeout(300);
    const care = await page.evaluate(() => ({stickyTop: Math.round(document.querySelector('.nm-care-sticky').getBoundingClientRect().top), visibleCards: [...document.querySelectorAll('.nm-care-card')].filter(card => {const r=card.getBoundingClientRect(); return r.right>0 && r.left<innerWidth && r.bottom>0 && r.top<innerHeight}).length}));
    if (width <= 760) {
      await page.evaluate(() => scrollTo(0,0));
      await page.getByRole('button', {name:'Abrir menú'}).click();
      await page.waitForTimeout(500);
      const nav = page.getByRole('navigation', {name:'Navegación móvil'});
      care.mobileNavVisible = await nav.isVisible();
      care.mobileNavColor = await nav.evaluate(element => getComputedStyle(element).backgroundColor);
      await page.getByRole('button', {name:'Cerrar menú'}).click();
    }
    results.push({width, ...first, ...care, errors});
    await page.close();
  }
  const page = await browser.newPage({viewport:{width:390,height:844}});
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(root);
  await page.getByRole('button', {name:'Ver Iced Latte'}).click();
  await page.waitForTimeout(600);
  const carousel = await page.locator('.nm-product-track').evaluate(element => element.scrollLeft);
  await page.goto(`${root}/carta/`);
  await page.locator('.product-card .add-button').first().click();
  const cart = await page.getByRole('dialog', {name:'Tu pedido'}).isVisible();
  await page.getByRole('button', {name:'Cerrar carrito'}).click();
  await page.goto(root);
  await page.locator('.nm-faq').scrollIntoViewIfNeeded();
  await page.locator('.nm-faq-item').nth(1).locator('button').click();
  const faq = await page.locator('.nm-faq-item').nth(1).locator('button').getAttribute('aria-expanded');
  await page.goto(`${root}/productos/`);
  const products = await page.locator('.products-empty').isVisible();
  results.push({flows:{carousel,cart,faq,products,errors}});
  await page.close();
  const reduced = await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await reduced.goto(root);
  const staticCards = await reduced.locator('.nm-care-card').evaluateAll(cards => cards.map(card => ({opacity:getComputedStyle(card).opacity,position:getComputedStyle(card).position})));
  results.push({reducedMotion:staticCards});
  await reduced.close();
  console.log(JSON.stringify(results,null,2));
} finally { await browser.close(); }
