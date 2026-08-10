import { mkdirSync } from 'node:fs';
import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL = 'http://localhost:5173/';
const OUT = 'docs/screenshots';

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
  defaultViewport: { width: 1440, height: 1100, deviceScaleFactor: 2 },
});

const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle2' });
await page.waitForSelector('h2', { timeout: 15000 });
await page.waitForSelector('[data-export-front="ready"]', { timeout: 12000 });
await new Promise((r) => setTimeout(r, 800));

async function clickTab(label) {
  await page.evaluate((name) => {
    const el = [...document.querySelectorAll('[role="tab"]')].find(
      (t) => t.textContent.trim() === name
    );
    el?.click();
  }, label);
  await new Promise((r) => setTimeout(r, 500));
}

await page.screenshot({ path: `${OUT}/desktop-pass.png`, fullPage: true });
console.log('wrote desktop-pass');

await clickTab('Back');
await new Promise((r) => setTimeout(r, 400));
await page.screenshot({ path: `${OUT}/desktop-back.png`, fullPage: false });
console.log('wrote desktop-back');

await clickTab('Front');
await clickTab('Dual');
await new Promise((r) => setTimeout(r, 600));
await page.screenshot({ path: `${OUT}/desktop-dual.png`, fullPage: false });
console.log('wrote desktop-dual');

await clickTab('Pass');
await clickTab('Frame');
await new Promise((r) => setTimeout(r, 500));
await page.screenshot({ path: `${OUT}/desktop-frame.png`, fullPage: false });
console.log('wrote desktop-frame');

await clickTab('Pass');
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
await new Promise((r) => setTimeout(r, 500));
await page.screenshot({ path: `${OUT}/mobile-pass.png`, fullPage: false });
console.log('wrote mobile-pass');
await page.screenshot({ path: `${OUT}/mobile-pass-full.png`, fullPage: true });
console.log('wrote mobile-pass-full');

await browser.close();
console.log('done');
