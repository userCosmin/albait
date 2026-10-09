// Browser checks against a running site: npm run test:e2e -- <url>
// Defaults to the local preview (npx astro preview). Uses an installed Chrome;
// set CHROME_PATH to point elsewhere.
import { chromium } from 'playwright-core';
const U = (process.argv[2] ?? 'http://localhost:4321').replace(/\/$/, '');
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
let failed = false;
const ok = (name, cond) => { if (!cond) failed = true; console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}`); };
const errors = [];

// 1. Mobile menu
{ const p = await b.newPage({ viewport: { width: 390, height: 844 } }); p.on('pageerror', e => errors.push(e.message));
  await p.goto(U + '/', { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
  await p.getByRole('button', { name: 'Deschide meniul' }).click();
  const dlg = p.getByRole('dialog', { name: 'Meniu' }); await dlg.waitFor({ timeout: 3000 });
  ok('mobile menu opens as dialog', await dlg.isVisible());
  ok('menu lists 5 links', (await dlg.getByRole('link').count()) >= 5);
  ok('focus moved into dialog', await p.evaluate(() => !!document.activeElement?.closest('[role=dialog]')));
  await p.keyboard.press('Escape'); await p.waitForTimeout(900);
  ok('Escape closes menu', (await p.getByRole('dialog').count()) === 0);
  await p.close(); }

// 2. Model finder
{ const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); p.on('pageerror', e => errors.push(e.message));
  await p.goto(U + '/produse/', { waitUntil: 'networkidle' });
  const first = async () => (await p.locator('ul li h3').first().textContent())?.trim();
  const before = await first();
  await p.getByRole('button', { name: /Am sertar de bani/ }).click(); await p.waitForTimeout(900);
  ok(`finder ranks a drawer-capable model first for "sertar" (was ${before})`, ['Incotex Succes M7', 'Incotex Succes M4'].includes(await first()));
  await p.getByRole('button', { name: /Lucrez pe drum/ }).click(); await p.waitForTimeout(600);
  ok('finder reports no full match for sertar+mobil', (await p.locator('[aria-live=polite]').first().textContent()).includes('Niciun model'));
  await p.close(); }

// 3. Form client validation (no network submit)
{ const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); p.on('pageerror', e => errors.push(e.message));
  let posted = false; p.on('request', r => { if (r.url().includes('/api/contact')) posted = true; });
  await p.goto(U + '/contact/?interes=Daisy%20Compact%20S', { waitUntil: 'networkidle' });
  await p.locator('#oferta').scrollIntoViewIfNeeded(); await p.waitForTimeout(1200);
  ok('interest preselected from ?interes=', (await p.locator('select[name=interest]').inputValue()) === 'Daisy Compact S');
  await p.getByRole('button', { name: /Trimite solicitarea/ }).click(); await p.waitForTimeout(400);
  const alerts = await p.getByRole('alert').allTextContents();
  ok(`empty submit shows errors (${alerts.length}) and does not post`, alerts.length >= 3 && !posted);
  ok('first invalid field focused', await p.evaluate(() => document.activeElement?.getAttribute('name') === 'name'));
  await p.close(); }

// 4. Reduced motion: every reveal visible
{ const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  await p.goto(U + '/', { waitUntil: 'networkidle' });
  const hidden = await p.evaluate(() => [...document.querySelectorAll('[data-reveal]')].filter(e => getComputedStyle(e).opacity === '0' || getComputedStyle(e).clipPath.includes('100%')).length);
  ok(`reduced motion: no hidden reveal elements (${hidden})`, hidden === 0);
  ok('reduced motion: js-motion class absent', !(await p.evaluate(() => document.documentElement.classList.contains('js-motion'))));
  await ctx.close(); }

// 5. No JavaScript: content present
{ const ctx = await b.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage();
  await p.goto(U + '/', { waitUntil: 'load' });
  ok('no-JS: h1 visible', await p.locator('h1').isVisible());
  ok('no-JS: hero product image visible', await p.locator('img[fetchpriority=high]').isVisible());
  ok('no-JS: form has action /api/contact/', (await p.locator('form[action="/api/contact/"]').count()) === 1);
  ok('no-JS: finder lists 4 models', (await p.locator('#finder-title ~ * ul > li, section[aria-labelledby=finder-title] ul > li').count()) >= 4);
  await ctx.close(); }

ok(`no page errors (${errors.join(' | ')})`, errors.length === 0);
await b.close();
if (failed) process.exit(1);
