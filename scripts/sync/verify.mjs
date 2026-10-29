/**
 * Verification - every asset referenced by the mirrored content must exist
 * under `public/`.
 *
 * Run after `npm run sync:content`:
 *   node scripts/sync/verify.mjs
 */

import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const PUBLIC = path.resolve('public');
const CACHE = path.resolve('.cache/wp');

async function exists(file) {
  try {
    const s = await stat(file);
    return s.size > 0;
  } catch {
    return false;
  }
}

const missing = new Map();

async function check(url) {
  const clean = url.split('?')[0];
  if (!clean.startsWith('/wp-content/')) return;
  const file = path.join(PUBLIC, clean.replace(/^\//, ''));
  if (!(await exists(file))) {
    missing.set(clean, (missing.get(clean) ?? 0) + 1);
  }
}

const pattern = /(?:\/|\\\/)(wp-content\\?\/[^"'\\\s()<>]+)/gi;

function collect(text) {
  for (const m of text.matchAll(pattern)) {
    const value = m[1].replace(/\\\//g, '/');
    if (/\.(jpg|jpeg|png|webp|avif|gif|svg|mp4|webm|pdf|woff2?|ttf|eot|ico|css|js)$/i.test(value)) {
      void check('/' + value);
    }
  }
}

for (const file of ['pages.json', 'posts.json']) {
  const items = JSON.parse(await readFile(path.join(CACHE, file), 'utf8'));
  for (const item of items) {
    collect(item.content?.rendered ?? '');
    collect(item.excerpt?.rendered ?? '');
  }
}

// The manifest carries the stylesheet/script list of every page snapshot.
const manifest = JSON.parse(await readFile(path.resolve('src/content/manifest.json'), 'utf8'));
for (const page of manifest) {
  for (const href of [...page.stylesheets, ...page.scripts]) {
    void check(href);
  }
}

// The downloaded CSS can point at more uploads.
for (const page of manifest) {
  for (const href of page.stylesheets) {
    if (!href.endsWith('.css')) continue;
    const local = path.join(PUBLIC, href.replace(/^\//, '').split('?')[0]);
    if (!(await exists(local))) continue;
    const css = await readFile(local, 'utf8');
    for (const m of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
      const ref = m[1];
      if (ref.startsWith('/wp-content/')) void check(ref);
    }
  }
}

await new Promise((resolve) => setTimeout(resolve, 500));

if (missing.size === 0) {
  console.log('OK - every referenced asset exists under public/');
} else {
  console.log(`MISSING ${missing.size} distinct assets:`);
  for (const [url, count] of missing) console.log(`  ${url} (referenced ${count}x)`);
  process.exitCode = 1;
}
