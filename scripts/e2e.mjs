import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL = 'http://localhost:5173/';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const errors = [];
const page = await browser.newPage();
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
});

await page.setViewport({ width: 1440, height: 900 });
await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });
await page.waitForSelector('h2', { timeout: 15000 });

const title = await page.title();
assert(title.includes('Hacker House'), `unexpected title: ${title}`);

const heading = await page.$eval('h2', (el) => el.textContent);
assert(heading.includes('Craft your builder pass'), `heading: ${heading}`);

const nameInput = await page.$('#name');
assert(nameInput, 'name field missing');

async function setInput(selector, value) {
  await page.focus(selector);
  await page.evaluate((sel, val) => {
    const el = document.querySelector(sel);
    const proto = Object.getPrototypeOf(el);
    const desc = Object.getOwnPropertyDescriptor(proto, 'value');
    desc.set.call(el, val);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, selector, value);
}

await setInput('#name', 'Maya Lin');
const nameVal = await page.$eval('#name', (el) => el.value);
assert(nameVal === 'Maya Lin', `name value ${nameVal}`);

await setInput('#name', 'A'.repeat(50));
const clipped = await page.$eval('#name', (el) => el.value.length);
assert(clipped <= 36, `name not clipped: ${clipped}`);

const tabs = await page.$$eval('[role="tab"]', (els) => els.map((e) => e.textContent.trim()));
assert(tabs.includes('Pass') && tabs.includes('Frame') && tabs.includes('Dual'), `tabs: ${tabs}`);

const allTabs = await page.$$('[role="tab"]');
let clickedBack = false;
for (const t of allTabs) {
  const text = await t.evaluate((el) => el.textContent.trim());
  if (text === 'Back') {
    await t.click();
    clickedBack = true;
    break;
  }
}
assert(clickedBack, 'could not click Back');
await page.waitForSelector('canvas', { timeout: 5000 });

for (const t of await page.$$('[role="tab"]')) {
  const text = await t.evaluate((el) => el.textContent.trim());
  if (text === 'Lanyard') {
    await t.click();
    break;
  }
}
await new Promise((r) => setTimeout(r, 700));

for (const t of await page.$$('[role="tab"]')) {
  const text = await t.evaluate((el) => el.textContent.trim());
  if (text === 'Frame') {
    await t.click();
    break;
  }
}
await new Promise((r) => setTimeout(r, 400));
const nameAfterFrame = await page.$('#name');
assert(!nameAfterFrame, 'name field should hide in frame mode');
assert(await page.$('#role'), 'role should remain in frame mode');

for (const t of await page.$$('[role="tab"]')) {
  const text = await t.evaluate((el) => el.textContent.trim());
  if (text === 'Dual') {
    await t.click();
    break;
  }
}
await new Promise((r) => setTimeout(r, 500));

for (const t of await page.$$('[role="tab"]')) {
  const text = await t.evaluate((el) => el.textContent.trim());
  if (text === 'Pass') {
    await t.click();
    break;
  }
}
await new Promise((r) => setTimeout(r, 300));

await page.waitForSelector('[data-export-front="ready"]', { timeout: 10000 });
await page.waitForSelector('[data-export-back="ready"]', { timeout: 10000 });

async function clickTab(label) {
  const handle = await page.evaluateHandle((name) => {
    return [...document.querySelectorAll('[role="tab"]')].find(
      (el) => el.textContent.trim() === name
    );
  }, label);
  const el = handle.asElement();
  assert(el, `tab ${label} missing`);
  await el.click();
  await new Promise((r) => setTimeout(r, 350));
}

await clickTab('Pass');
await clickTab('Front');

const downloadBtn = await page.evaluateHandle(() => {
  return [...document.querySelectorAll('button')].find((b) => {
    const t = b.textContent.replace(/\s+/g, ' ').trim();
    return /Download (pass|frame|both sides)/i.test(t) && b.offsetParent !== null;
  });
});
assert(downloadBtn && downloadBtn.asElement(), 'visible download button missing');
const downloadText = await downloadBtn.asElement().evaluate((el) => el.textContent);
assert(downloadText.includes('Download pass'), `expected pass download, got ${downloadText}`);
await downloadBtn.asElement().click();
try {
  await page.waitForSelector('[role="dialog"]', { timeout: 8000 });
} catch {
  await page.screenshot({ path: 'qa-fail.png', fullPage: true });
  const body = await page.evaluate(() => document.body.innerText.slice(0, 1500));
  throw new Error(`dialog missing. page text:\n${body}`);
}
await page.keyboard.press('Escape');
await new Promise((r) => setTimeout(r, 300));
const dialogGone = (await page.$('[role="dialog"]')) === null;
assert(dialogGone, 'dialog did not close on Escape');

await page.setViewport({ width: 390, height: 844 });
await new Promise((r) => setTimeout(r, 400));
const overflow = await page.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
);
assert(!overflow, 'horizontal overflow on mobile');

await page.screenshot({ path: 'qa-mobile.png', fullPage: true });
await page.setViewport({ width: 1440, height: 900 });
await page.screenshot({ path: 'qa-desktop.png', fullPage: true });

const filteredErrors = errors.filter(
  (e) =>
    !e.includes('Download is disallowed') &&
    !e.includes('NotAllowedError') &&
    !e.includes('favicon')
);

await browser.close();

if (filteredErrors.length) {
  console.error('PAGE ERRORS', filteredErrors);
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, title, heading, nameVal, clipped, tabs }, null, 2));
