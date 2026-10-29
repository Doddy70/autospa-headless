/**
 * Step 2 - Download the assets each page needs and localise them.
 *
 * Sources (all GET, production is read-only):
 *   - stylesheets + scripts referenced by the live page HTML
 *   - every upload URL (image/font/video) referenced by page & post content
 *   - upload URLs referenced from inside the downloaded CSS (background images)
 *
 * Everything is mirrored under `public/wp-content/...` using the SAME path it
 * has on production, so rewriting a URL is just dropping the origin:
 *
 *   https://autospajakarta.com/wp-content/uploads/x.jpg
 *   -> /wp-content/uploads/x.jpg
 *
 * Usage: node scripts/sync/assets.mjs
 */

import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const SITE = process.env.WORDPRESS_SITE_URL ?? 'https://autospajakarta.com';
const CACHE = path.resolve('.cache/wp');
const PUBLIC = path.resolve('public');
const CONCURRENCY = 8;

const failures = [];
let downloaded = 0;
let skipped = 0;

/** Map an absolute production URL to its local path inside public/. */
function localPathFor(url) {
  const u = new URL(url);
  if (u.host !== 'autospajakarta.com') return null;
  return path.join(PUBLIC, decodeURIComponent(u.pathname).replace(/^\/+/, ''));
}

async function exists(file) {
  try {
    const s = await stat(file);
    return s.size > 0;
  } catch {
    return false;
  }
}

async function download(url) {
  const local = localPathFor(url);
  if (!local) return false;
  if (await exists(local)) {
    skipped += 1;
    return true;
  }
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AutoSPA-Sync/1.0)' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await mkdir(path.dirname(local), { recursive: true });
    await writeFile(local, buf);
    downloaded += 1;
    return true;
  } catch (error) {
    failures.push(`${url} -> ${error.message}`);
    return false;
  }
}

/** Run tasks with a bounded number of parallel downloads. */
async function pool(tasks, limit = CONCURRENCY) {
  const queue = [...tasks];
  const workers = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length) {
      const task = queue.shift();
      await task();
    }
  });
  await Promise.all(workers);
}

/* ------------------------------------------------------------------ *
 * 1. CSS + JS referenced by the live HTML of every page
 * ------------------------------------------------------------------ */

const htmlDir = path.join(CACHE, 'html');
const htmlFiles = (await readdir(htmlDir)).filter((f) => f.endsWith('.html'));

const assetUrls = new Set();

for (const file of htmlFiles) {
  const html = await readFile(path.join(htmlDir, file), 'utf8');
  for (const m of html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi)) {
    const href = m[0].match(/href=["']([^"']+)["']/i)?.[1];
    if (href) assetUrls.add(href.startsWith('//') ? `https:${href}` : href);
  }
  for (const m of html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)) {
    assetUrls.add(m[1].startsWith('//') ? `https:${m[1]}` : m[1]);
  }
}

const localAssets = [...assetUrls].filter((u) => u.includes('autospajakarta.com'));
console.log(`assets referenced: ${localAssets.length} local of ${assetUrls.size} total`);

await pool(localAssets.map((url) => () => download(url)));

/* ------------------------------------------------------------------ *
 * 2. Upload URLs referenced by page & post content
 * ------------------------------------------------------------------ */

const uploadUrls = new Set();
const uploadPattern = /https?:\\?\/\\?\/autospajakarta\.com\\?\/wp-content\\?\/uploads\\?\/[^"'\\\s()<>]+/gi;

function collectUploads(text) {
  for (const m of text.matchAll(uploadPattern)) {
    // The raw HTML stores URLs with escaped slashes in some attributes.
    const cleaned = m[0].replace(/\\\//g, '/').replace(/&amp;/g, '&');
    if (/\.(jpg|jpeg|png|webp|avif|gif|svg|mp4|webm|pdf|woff2?|ttf|eot|ico)(\?|$)/i.test(cleaned)) {
      uploadUrls.add(cleaned);
    }
  }
}

for (const file of ['pages.json', 'posts.json']) {
  const items = JSON.parse(await readFile(path.join(CACHE, file), 'utf8'));
  for (const item of items) {
    collectUploads(item.content?.rendered ?? '');
    collectUploads(item.excerpt?.rendered ?? '');
  }
}

console.log(`uploads referenced: ${uploadUrls.size}`);
await pool([...uploadUrls].map((url) => () => download(url)));

/* ------------------------------------------------------------------ *
 * 3. Upload URLs referenced from inside the downloaded CSS
 * ------------------------------------------------------------------ */

const cssFiles = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (entry.name.endsWith('.css')) cssFiles.push(full);
  }
}
await walk(path.join(PUBLIC, 'wp-content'));

const cssUploads = new Set();
for (const file of cssFiles) {
  const css = await readFile(file, 'utf8');
  // The stylesheet may reference its fonts and images relative to itself, so
  // resolve every url() against the production URL of the stylesheet.
  const cssUrl = `${SITE}/${path.relative(PUBLIC, file).split(path.sep).join('/')}`;

  for (const m of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
    const ref = m[1];
    if (ref.startsWith('data:')) continue;
    if (!/\.(jpg|jpeg|png|webp|avif|gif|svg|woff2?|ttf|eot)(\?|$)/i.test(ref)) continue;

    let absolute;
    try {
      absolute = new URL(ref, cssUrl).toString();
    } catch {
      continue;
    }
    if (!absolute.includes('autospajakarta.com')) continue;
    cssUploads.add(absolute);
  }
}

console.log(`uploads referenced from CSS: ${cssUploads.size}`);
await pool([...cssUploads].map((url) => () => download(url)));

/* ------------------------------------------------------------------ */

console.log(`\ndownloaded: ${downloaded}, already present: ${skipped}, failed: ${failures.length}`);
if (failures.length) {
  console.log('failures:');
  for (const f of failures.slice(0, 30)) console.log('  ' + f);
  if (failures.length > 30) console.log(`  ... and ${failures.length - 30} more`);
  await writeFile(path.join(CACHE, 'asset-failures.json'), JSON.stringify(failures, null, 2));
}
