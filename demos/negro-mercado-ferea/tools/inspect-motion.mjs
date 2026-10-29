import { chromium } from 'playwright-core';

const browser = await chromium.launch({headless: true, executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
const page = await browser.newPage({viewport: {width: 1440, height: 900}});
const url = 'https://fereacafe.framer.website/';
const interesting = ['h1', 'h2', 'h3', 'button', 'a', 'img', '[data-framer-name]'];
try {
  await page.goto(url, {waitUntil: 'domcontentloaded', timeout: 30000});
  const inspect = async label => {
    const result = await page.evaluate(selectors => {
      const animations = document.getAnimations({subtree: true}).filter(animation => animation.playState === 'running').slice(0, 18).map(animation => {
        const effect = animation.effect;
        const element = effect?.target;
        return {
          target: element?.tagName + '.' + String(element?.className || '').slice(0, 55),
          text: element?.textContent?.trim().slice(0, 55),
          duration: effect?.getTiming().duration,
          iterations: effect?.getTiming().iterations,
          frames: effect?.getKeyframes().map(frame => ({opacity: frame.opacity, transform: frame.transform, offset: frame.offset})).slice(0, 3),
        };
      });
      const nodes = [...document.querySelectorAll(selectors.join(','))].filter(element => {
        const rect = element.getBoundingClientRect();
        return rect.top > -100 && rect.top < innerHeight && rect.width > 20 && rect.height > 20;
      }).slice(0, 18).map(element => {
        const style = getComputedStyle(element);
        return {tag: element.tagName, text: element.textContent?.trim().slice(0, 50), top: Math.round(element.getBoundingClientRect().top), opacity: style.opacity, transform: style.transform, transition: style.transitionDuration};
      });
      return {y: scrollY, animations, nodes};
    }, interesting);
    console.log(JSON.stringify({label, ...result}));
  };
  await inspect('load');
  await page.waitForTimeout(250);
  await inspect('250ms');
  await page.waitForTimeout(650);
  await inspect('900ms');
  await page.evaluate(() => scrollTo(0, 950));
  await page.waitForTimeout(100);
  await inspect('scroll-first-100ms');
  await page.waitForTimeout(650);
  await inspect('scroll-first-750ms');
  await page.evaluate(() => scrollTo(0, 2650));
  await page.waitForTimeout(100);
  await inspect('scroll-menu-100ms');
  await page.waitForTimeout(650);
  await inspect('scroll-menu-750ms');
} finally { await browser.close(); }
