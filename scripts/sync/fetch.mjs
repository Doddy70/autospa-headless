/**
 * Step 1 - Pull the raw WordPress REST payloads we need from the production
 * site (READ ONLY) into `.cache/wp/`.
 *
 * Production is never written to. Every call below is a GET against
 * /wp-json/wp/v2/*.
 *
 * Usage: node scripts/sync/fetch.mjs
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const REST = process.env.WORDPRESS_REST_URL ?? 'https://autospajakarta.com/wp-json';
const SITE = process.env.WORDPRESS_SITE_URL ?? 'https://autospajakarta.com';
const OUT = path.resolve('.cache/wp');

/** Fetch every page of a REST collection, following X-WP-TotalPages. */
async function fetchAll(collection, params = {}) {
  const query = new URLSearchParams({ per_page: '100', ...params });
  const first = await fetch(`${REST}/wp/v2/${collection}?${query}`);

  if (!first.ok) {
    throw new Error(`${collection}: HTTP ${first.status} ${first.statusText}`);
  }

  const total = Number(first.headers.get('X-WP-Total') ?? '0');
  const totalPages = Number(first.headers.get('X-WP-TotalPages') ?? '1');
  const items = await first.json();

  for (let page = 2; page <= totalPages; page += 1) {
    const next = new URL(`${REST}/wp/v2/${collection}`);
    next.search = new URLSearchParams({ ...Object.fromEntries(query), page: String(page) });
    const res = await fetch(next);
    if (!res.ok) throw new Error(`${collection} page ${page}: HTTP ${res.status}`);
    items.push(...(await res.json()));
  }

  console.log(`${collection}: ${items.length}/${total} items`);
  return items;
}

/** Grab the rendered HTML of a public page (used for its asset manifest). */
async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AutoSPA-Sync/1.0)' },
  });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.text();
}

await mkdir(OUT, { recursive: true });

const pages = await fetchAll('pages');
const posts = await fetchAll('posts');
const categories = await fetchAll('categories');
// The media collection is flaky to paginate on production (HTTP 500 on some
// pages) and we do not need it: every media file we ship is discovered by
// scanning the page/post HTML for upload URLs.

await writeFile(path.join(OUT, 'pages.json'), JSON.stringify(pages, null, 2));
await writeFile(path.join(OUT, 'posts.json'), JSON.stringify(posts, null, 2));
await writeFile(path.join(OUT, 'categories.json'), JSON.stringify(categories, null, 2));

// The live HTML of every page tells us which CSS/JS that specific page loads.
const htmlDir = path.join(OUT, 'html');
await mkdir(htmlDir, { recursive: true });

for (const page of pages) {
  const url = `${SITE}/${page.slug}/`;
  const html = await fetchHtml(url);
  await writeFile(path.join(htmlDir, `${page.slug}.html`), html);
  console.log(`html: ${page.slug}`);
}
