import { mkdirSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL = 'http://localhost:5173/';
const JPG = '/tmp/hhg-fixtures/portrait.jpg';
const HEIC = '/tmp/hhg-fixtures/portrait.heic';
const DL = '/tmp/hhg-downloads';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function results() {
  return { passed: [], failed: [] };
}

const report = results();

async function check(name, fn) {
  try {
    await fn();
    report.passed.push(name);
    console.log(`PASS  ${name}`);
  } catch (err) {
    report.failed.push({ name, error: String(err.message || err) });
    console.error(`FAIL  ${name}\n      ${err.message || err}`);
  }
}

if (existsSync(DL)) rmSync(DL, { recursive: true, force: true });
mkdirSync(DL, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const context = browser.defaultBrowserContext();
await context.overridePermissions('http://localhost:5173', [
  'clipboard-read',
  'clipboard-write',
]);

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e)));

await page.evaluateOnNewDocument(() => {
  window.__downloads = [];
  window.__opens = [];
  const protoClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function clickHook() {
    if (this.download) {
      window.__downloads.push({
        name: this.download,
        href: String(this.href || '').slice(0, 32),
        bytes: String(this.href || '').length,
      });
    }
    return protoClick.apply(this, arguments);
  };
  window.open = (url) => {
    window.__opens.push(String(url));
    return null;
  };
  navigator.canShare = () => false;
  navigator.share = async () => {
    throw new Error('share unsupported in test');
  };
  window.__copiedText = null;
  window.__copiedImage = false;
  const clip = navigator.clipboard;
  const writeText = clip.writeText.bind(clip);
  const write = clip.write.bind(clip);
  clip.writeText = async (text) => {
    window.__copiedText = String(text);
    try {
      return await writeText(text);
    } catch {
      return undefined;
    }
  };
  clip.write = async (items) => {
    window.__copiedImage = items.some((item) => item.types?.includes('image/png'));
    try {
      return await write(items);
    } catch {
      return undefined;
    }
  };
});

await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });
await page.waitForSelector('h2', { timeout: 15000 });
await page.waitForSelector('[data-export-front="ready"]', { timeout: 12000 });

async function clickTab(label) {
  const clicked = await page.evaluate((name) => {
    const el = [...document.querySelectorAll('[role="tab"]')].find(
      (t) => t.textContent.trim() === name
    );
    if (!el) return false;
    el.click();
    return true;
  }, label);
  assert(clicked, `tab "${label}" not found`);
  await new Promise((r) => setTimeout(r, 450));
}

async function selectedTab(label) {
  return page.evaluate((name) => {
    const el = [...document.querySelectorAll('[role="tab"]')].find(
      (t) => t.textContent.trim() === name
    );
    return el?.getAttribute('aria-selected') === 'true';
  }, label);
}

async function setInput(selector, value) {
  await page.waitForSelector(selector, { timeout: 5000 });
  await page.evaluate(
    (sel, val) => {
      const el = document.querySelector(sel);
      const proto = Object.getPrototypeOf(el);
      const desc = Object.getOwnPropertyDescriptor(proto, 'value');
      desc.set.call(el, val);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    },
    selector,
    value
  );
}

async function clickVisible(matcher) {
  const handle = await page.evaluateHandle((reSource) => {
    const re = new RegExp(reSource, 'i');
    return [...document.querySelectorAll('button')].find((b) => {
      const t = b.textContent.replace(/\s+/g, ' ').trim();
      return re.test(t) && b.offsetParent !== null && !b.disabled;
    });
  }, matcher);
  const el = handle.asElement();
  assert(el, `visible button /${matcher}/ not found`);
  await el.click();
  return el;
}

async function frontSnapshot() {
  return page.evaluate(() => {
    const canvases = [...document.querySelectorAll('canvas')].filter(
      (c) => c.width === 450 && c.height === 820
    );
    if (!canvases.length) return null;
    const c = canvases[canvases.length - 1];
    return c.toDataURL('image/png');
  });
}

async function waitForPhotoReady() {
  await page.waitForFunction(
    () => document.body.innerText.includes('Portrait ready'),
    { timeout: 12000 }
  );
  await new Promise((r) => setTimeout(r, 700));
}

// ---------------------------------------------------------------------------
await check('Switch Pass / Frame / Dual and Front / Back / Lanyard', async () => {
  await clickTab('Pass');
  assert(await selectedTab('Pass'), 'Pass not selected');
  await clickTab('Front');
  assert(await selectedTab('Front'), 'Front not selected');
  assert(await page.$('#name'), 'name field missing on Pass');

  await clickTab('Back');
  assert(await selectedTab('Back'), 'Back not selected');
  const preview = await page.evaluate(() =>
    document.body.innerText.includes('Reverse')
  );
  assert(preview, 'Back preview label missing');

  await clickTab('Front');
  await clickTab('Lanyard');
  assert(await selectedTab('Lanyard'), 'Lanyard not selected');
  await page.waitForFunction(
    () => document.body.innerText.includes('Drag the lanyard'),
    { timeout: 5000 }
  );
  const webgl = await page.evaluate(() =>
    [...document.querySelectorAll('canvas')].some((c) => {
      try {
        return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
      } catch {
        return false;
      }
    })
  );
  assert(webgl, '3D canvas missing');

  await clickTab('Flat');
  await clickTab('Frame');
  assert(await selectedTab('Frame'), 'Frame not selected');
  assert(!(await page.$('#name')), 'name should hide on Frame');
  assert(await page.$('#role'), 'role should stay on Frame');
  assert(await page.$('#team'), 'team should stay on Frame');
  const square = await page.evaluate(() =>
    [...document.querySelectorAll('canvas')].some((c) => c.width === 1000 && c.height === 1000)
  );
  assert(square, 'PFP canvas missing');

  await clickTab('Dual');
  assert(await selectedTab('Dual'), 'Dual not selected');
  const dualCopy = await page.evaluate(() => document.body.innerText.includes('Front and back'));
  assert(dualCopy, 'Dual preview copy missing');
  const dualCanvases = await page.evaluate(
    () => [...document.querySelectorAll('canvas')].filter((c) => c.width === 450).length
  );
  assert(dualCanvases >= 2, `expected 2+ pass canvases in Dual, got ${dualCanvases}`);

  await clickTab('Pass');
  await clickTab('Front');
});

await check('Upload a JPG and confirm crop/grade update the pass', async () => {
  await clickTab('Pass');
  await clickTab('Front');
  const before = await frontSnapshot();
  const photoInput = await page.$('input[accept*="heic"]');
  assert(photoInput, 'photo file input missing');
  await photoInput.uploadFile(JPG);
  await waitForPhotoReady();
  const afterUpload = await frontSnapshot();
  assert(afterUpload, 'front canvas missing after JPG');
  assert(afterUpload !== before, 'JPG did not change the pass pixels');

  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Film');
    btn?.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  const afterFilter = await frontSnapshot();
  assert(afterFilter !== afterUpload, 'Film grade did not change the pass');

  async function setRange(selector, value) {
    await page.$eval(
      selector,
      (el, val) => {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(el, String(val));
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      },
      value
    );
  }

  await setRange('input[aria-label="Photo scale"]', 1.8);
  await new Promise((r) => setTimeout(r, 400));
  const scaleLabel = await page.evaluate(() =>
    [...document.querySelectorAll('span')].some((s) => s.textContent.trim() === '180%')
  );
  assert(scaleLabel, 'scale slider did not update to 180%');

  await setRange('input[aria-label="Horizontal offset"]', 120);
  await new Promise((r) => setTimeout(r, 800));
  const offsetLabel = await page.evaluate(() =>
    [...document.querySelectorAll('span')].some((s) => s.textContent.trim() === '120px')
  );
  assert(offsetLabel, 'X offset slider did not update to 120px');
  const afterOffset = await frontSnapshot();
  assert(afterOffset !== afterFilter, 'X offset did not change the pass pixels');
});

await check('Upload a HEIC and confirm it lands on the pass', async () => {
  const remove = await page.evaluateHandle(() =>
    [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Remove'))
  );
  if (remove.asElement()) await remove.asElement().click();
  await new Promise((r) => setTimeout(r, 200));

  const before = await frontSnapshot();
  const photoInput = await page.$('input[accept*="heic"]');
  await photoInput.uploadFile(HEIC);
  await waitForPhotoReady();
  const after = await frontSnapshot();
  assert(after !== before, 'HEIC did not change the pass');
  const ready = await page.evaluate(() => document.body.innerText.includes('Portrait ready'));
  assert(ready, 'HEIC upload did not show Portrait ready');
});

await check('Download pass (both sides) and frame; confirm filenames', async () => {
  await page.evaluate(() => {
    window.__downloads = [];
  });
  await clickTab('Pass');
  await setInput('#name', 'Maya Lin');
  await new Promise((r) => setTimeout(r, 200));
  await clickTab('Dual');
  await page.waitForSelector('[data-export-front="ready"]', { timeout: 8000 });
  await page.waitForSelector('[data-export-back="ready"]', { timeout: 8000 });
  await clickVisible('Download both sides');
  await page.waitForSelector('[role="dialog"]', { timeout: 8000 });
  await new Promise((r) => setTimeout(r, 500));
  let downloads = await page.evaluate(() => window.__downloads);
  const names = downloads.map((d) => d.name);
  assert(
    names.some((n) => n === 'HH-Goa-2026-FRONT-Maya_Lin.png'),
    `missing front file: ${names.join(', ')}`
  );
  assert(
    names.some((n) => n === 'HH-Goa-2026-BACK-Maya_Lin.png'),
    `missing back file: ${names.join(', ')}`
  );
  assert(
    downloads.every((d) => d.bytes > 1000),
    'downloaded data URLs look empty'
  );
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 250));

  await page.evaluate(() => {
    window.__downloads = [];
  });
  await clickTab('Frame');
  await clickVisible('Download frame');
  await page.waitForSelector('[role="dialog"]', { timeout: 8000 });
  downloads = await page.evaluate(() => window.__downloads);
  assert(
    downloads.some((d) => d.name === 'HH-Goa-2026-Frame-Maya_Lin.png'),
    `missing frame file: ${downloads.map((d) => d.name).join(', ')}`
  );
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 250));
  await clickTab('Pass');
});

await check('Share modal: copy image, copy caption, open X', async () => {
  await page.evaluate(() => {
    window.__opens = [];
    window.__downloads = [];
  });
  await clickTab('Pass');
  await clickVisible('Share on X');
  await page.waitForSelector('[role="dialog"]', { timeout: 8000 });

  const opensFromShare = await page.evaluate(() => window.__opens);
  assert(
    opensFromShare.some((u) => u.startsWith('https://x.com/intent/post?text=')),
    `Share on X did not open intent: ${opensFromShare.join(' | ')}`
  );
  assert(
    opensFromShare.some((u) => u.includes('HackerHouseGoa') && u.includes('247pmstudio')),
    'intent missing studio tag or hashtags'
  );

  await page.evaluate(() => {
    window.__opens = [];
  });
  await clickVisible('Copy caption');
  await page.waitForFunction(() => Boolean(window.__copiedText), { timeout: 4000 });
  const caption = await page.evaluate(() => window.__copiedText);
  assert(caption.includes('Hacker House Goa 2026'), `caption: ${caption}`);
  assert(caption.includes('@247pmstudio'), 'caption missing @247pmstudio');
  assert(caption.includes('#HackerHouseGoa'), 'caption missing hashtag');
  await page.waitForFunction(
    () => [...document.querySelectorAll('button')].some((b) => /\bCopied\b/.test(b.textContent)),
    { timeout: 3000 }
  );

  await clickVisible('Copy image');
  await page.waitForFunction(() => window.__copiedImage === true, { timeout: 4000 });

  await clickVisible('Open X');
  await new Promise((r) => setTimeout(r, 200));
  const opensFromModal = await page.evaluate(() => window.__opens);
  assert(
    opensFromModal.some((u) => u.startsWith('https://x.com/intent/post?text=')),
    `Open X did not fire intent: ${opensFromModal.join(' | ')}`
  );

  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 250));
});

await check('Phone width: sticky bar, no horizontal scroll, Dual stacks', async () => {
  await clickTab('Dual');
  await page.setViewport({ width: 390, height: 844 });
  await new Promise((r) => setTimeout(r, 500));

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
  );
  assert(!overflow, 'horizontal overflow on 390px');

  const sticky = await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('button')].filter((b) => {
      const t = b.textContent.replace(/\s+/g, ' ').trim();
      return (t === 'Download' || t === 'Share') && b.offsetParent !== null;
    });
    if (buttons.length < 2) return { ok: false, count: buttons.length };
    const rects = buttons.map((b) => b.getBoundingClientRect());
    const nearBottom = rects.every((r) => r.bottom > 780 && r.top > 740);
    return { ok: nearBottom, rects: rects.map((r) => ({ top: r.top, bottom: r.bottom })) };
  });
  assert(sticky.ok, `sticky bar not pinned to bottom: ${JSON.stringify(sticky)}`);

  const stacked = await page.evaluate(() => {
    const labels = [...document.querySelectorAll('span')].filter((el) =>
      /^(Front|Back)$/.test(el.textContent.trim())
    );
    if (labels.length < 2) return { ok: false, count: labels.length };
    const a = labels[0].getBoundingClientRect();
    const b = labels[1].getBoundingClientRect();
    return {
      ok: b.top > a.bottom + 20,
      a: { top: a.top, bottom: a.bottom, left: a.left },
      b: { top: b.top, bottom: b.bottom, left: b.left },
    };
  });
  assert(stacked.ok, `Dual did not stack on phone: ${JSON.stringify(stacked)}`);

  await page.setViewport({ width: 1440, height: 900 });
  await new Promise((r) => setTimeout(r, 300));
  await clickTab('Pass');
});

await check('Refresh: name/role/team/ID persist; photo does not', async () => {
  await clickTab('Pass');
  await setInput('#name', 'Priya Nair');
  await setInput('#role', 'Mentor');
  await setInput('#team', 'House');
  await setInput('#pass-id', 'HHG-4242-Z');
  await new Promise((r) => setTimeout(r, 400));

  const photoInput = await page.$('input[accept*="heic"]');
  await photoInput.uploadFile(JPG);
  await waitForPhotoReady();
  assert(
    await page.evaluate(() => document.body.innerText.includes('Portrait ready')),
    'photo should be present before refresh'
  );

  await page.reload({ waitUntil: 'networkidle2' });
  await page.waitForSelector('#name', { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 400));

  const persisted = await page.evaluate(() => ({
    name: document.querySelector('#name')?.value,
    role: document.querySelector('#role')?.value,
    team: document.querySelector('#team')?.value,
    id: document.querySelector('#pass-id')?.value,
    photo: document.body.innerText.includes('Portrait ready'),
    stored: localStorage.getItem('hhg-pass-v1'),
  }));

  assert(persisted.name === 'Priya Nair', `name lost: ${persisted.name}`);
  assert(persisted.role === 'Mentor', `role lost: ${persisted.role}`);
  assert(persisted.team === 'House', `team lost: ${persisted.team}`);
  assert(persisted.id === 'HHG-4242-Z', `id lost: ${persisted.id}`);
  assert(!persisted.photo, 'photo should not persist across refresh');
  assert(persisted.stored && !persisted.stored.includes('data:image'), 'photo leaked into localStorage');
});

await browser.close();

console.log(
  JSON.stringify(
    {
      ok: report.failed.length === 0,
      passed: report.passed,
      failed: report.failed,
      pageErrors: pageErrors.filter(
        (e) => !e.includes('Download is disallowed') && !e.includes('NotAllowedError')
      ),
    },
    null,
    2
  )
);

if (report.failed.length) process.exit(1);
