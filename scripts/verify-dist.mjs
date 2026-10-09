// Post-build checks on dist/client: SEO metadata, structured data, internal
// links, images and sitemap coverage. Exits with code 1 on any failure.
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

const ROOT = 'dist/client';
const SITE = 'https://albait.ro';
const failures = [];
const fail = (page, msg) => failures.push(`${page}: ${msg}`);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const exists = async (p) => !!(await stat(p).catch(() => null));
const files = await walk(ROOT);
const htmlFiles = files.filter((f) => f.endsWith('.html'));

const redirects = new Set(
  (await readFile(join(ROOT, '_redirects'), 'utf8'))
    .split('\n')
    .filter((l) => l.trim() && !l.startsWith('#'))
    .map((l) => l.trim().split(/\s+/)[0]),
);

// Pages served by the Worker rather than as files.
const dynamicRoutes = new Set(['/api/contact/']);

async function resolveInternal(pathname) {
  const clean = decodeURI(pathname.split('#')[0].split('?')[0]);
  if (!clean || dynamicRoutes.has(clean) || redirects.has(clean)) return true;
  const candidates = clean.endsWith('/')
    ? [join(ROOT, clean, 'index.html')]
    : [join(ROOT, clean), join(ROOT, `${clean}.html`), join(ROOT, clean, 'index.html')];
  for (const c of candidates) if (await exists(c)) return true;
  return false;
}

const titles = new Map();
const descriptions = new Map();
const indexable = [];

for (const file of htmlFiles) {
  const page = '/' + relative(ROOT, file).replace(/index\.html$/, '').replace(/\.html$/, '/');
  const html = await readFile(file, 'utf8');
  const noindex = /<meta name="robots" content="noindex/.test(html);

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  const h1s = html.match(/<h1[\s>]/g)?.length ?? 0;

  if (!/<html lang="ro"/.test(html)) fail(page, 'missing lang="ro"');
  if (!title) fail(page, 'missing <title>');
  else if (title.length > 70 && !noindex) fail(page, `title too long (${title.length}): ${title}`);
  if (!desc) fail(page, 'missing meta description');
  else if ((desc.length < 70 || desc.length > 170) && !noindex) fail(page, `description length ${desc.length}`);
  if (h1s !== 1) fail(page, `expected exactly one <h1>, found ${h1s}`);
  if (!/<meta property="og:image" content="https:\/\//.test(html)) fail(page, 'missing absolute og:image');

  if (!noindex) {
    if (!canonical) fail(page, 'missing canonical');
    else if (canonical !== `${SITE}${page}` && page !== '/404/') fail(page, `canonical ${canonical} ≠ ${SITE}${page}`);
    if (titles.has(title)) fail(page, `duplicate title with ${titles.get(title)}`);
    if (descriptions.has(desc)) fail(page, `duplicate description with ${descriptions.get(desc)}`);
    titles.set(title, page);
    descriptions.set(desc, page);
    indexable.push(page);
  }

  // JSON-LD must parse.
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(m[1]);
      const text = JSON.stringify(data);
      if (/"(offers|aggregateRating|review|price)"/.test(text)) fail(page, 'JSON-LD contains unverified commerce/rating data');
    } catch (e) {
      fail(page, `invalid JSON-LD: ${e.message}`);
    }
  }

  // Images: alt attribute present, local sources exist.
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    if (!/\balt(?=[\s=>\/])/.test(tag)) fail(page, `img without alt: ${tag.slice(0, 80)}`);
    const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
    if (src?.startsWith('/') && !(await exists(join(ROOT, decodeURI(src.split('?')[0]))))) fail(page, `missing image ${src}`);
  }
  for (const m of html.matchAll(/\bsrcset="([^"]+)"/gi)) {
    for (const part of m[1].split(',')) {
      const url = part.trim().split(/\s+/)[0];
      if (url.startsWith('/') && !(await exists(join(ROOT, decodeURI(url))))) fail(page, `missing srcset image ${url}`);
    }
  }

  // Internal links resolve.
  for (const m of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    let href = m[1].replace(/&amp;/g, '&');
    if (href.startsWith(SITE)) href = href.slice(SITE.length) || '/';
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    if (!(await resolveInternal(href))) fail(page, `broken link ${href}`);
  }
}

// Sitemap covers every indexable page and nothing else.
const sitemapFile = files.find((f) => /sitemap-0\.xml$/.test(f));
if (!sitemapFile) failures.push('sitemap-0.xml missing');
else {
  const xml = await readFile(sitemapFile, 'utf8');
  const urls = new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, '')));
  for (const p of indexable) if (p !== '/404/' && !urls.has(p)) failures.push(`sitemap missing ${p}`);
  for (const u of urls) if (!indexable.includes(u)) failures.push(`sitemap lists non-indexable ${u}`);
}

for (const f of ['robots.txt', 'llms.txt', '_headers', '_redirects', 'site.webmanifest']) {
  if (!(await exists(join(ROOT, f)))) failures.push(`missing ${f}`);
}

console.log(`Checked ${htmlFiles.length} HTML pages (${indexable.length} indexable).`);
if (failures.length) {
  console.error(`\n${failures.length} problem(s):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log('All checks passed.');
