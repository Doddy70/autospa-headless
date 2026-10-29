/**
 * Step 3 - Turn the cached production payloads into the files the Next.js
 * app consumes:
 *
 *   src/content/pages/<slug>.html   raw Elementor markup, upload URLs rewritten
 *                                   to their local /wp-content/... path
 *   src/content/manifest.ts         typed metadata: title, description,
 *                                   stylesheets, scripts, inline scripts
 *
 * Usage: node scripts/sync/build-manifest.mjs
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const CACHE = path.resolve('.cache/wp');
const OUT = path.resolve('src/content');
const PAGES_OUT = path.join(OUT, 'pages');

const SITE = 'https://autospajakarta.com';

/** Drop the production origin from an absolute URL so it resolves locally. */
function localise(value) {
  return value.split(SITE).join('');
}

function text(value) {
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

const pages = JSON.parse(await readFile(path.join(CACHE, 'pages.json'), 'utf8'));
const categories = JSON.parse(await readFile(path.join(CACHE, 'categories.json'), 'utf8'));

await mkdir(PAGES_OUT, { recursive: true });

/**
 * Analytics and ad pixels are intentionally dropped: the staging site should
 * not report into the production GA / Meta / Google Ads properties.
 */
const ANALYTICS = /gtag|dataLayer|fbq|googletagmanager|google-analytics|\bpixel\b|prefetch|adsbygoogle|hotjar/i;

const manifest = [];

for (const page of pages) {
  const slug = page.slug;
  const live = await readFile(path.join(CACHE, 'html', `${slug}.html`), 'utf8');

  // --- stylesheets ---------------------------------------------------
  // --- assets, in document order -------------------------------------
  // The order matters: jQuery has to be in place before the plugins that
  // depend on it, and Elementor reads its inline config before booting.
  const assets = [];
  const stylesheets = [];
  const seenStyles = new Set();
  let jsonLd = null;

  const tokenPattern =
    /<link[^>]+rel=["']stylesheet["'][^>]*>|<script[^>]*>[\s\S]*?<\/script>/gi;

  for (const match of live.matchAll(tokenPattern)) {
    const tag = match[0];

    if (/^<link/i.test(tag)) {
      const href = tag.match(/href=["']([^"']+)["']/i)?.[1];
      if (!href) continue;
      const absolute = href.startsWith('//') ? `https:${href}` : href;
      if (!absolute.includes('autospajakarta.com')) continue; // keep google fonts remote
      const local = localise(absolute);
      assets.push({ kind: 'style', src: local });
      if (!seenStyles.has(local)) {
        seenStyles.add(local);
        stylesheets.push(local);
      }
      continue;
    }

    // --- script -------------------------------------------------------
    const src = tag.match(/\ssrc=["']([^"']+)["']/i)?.[1];
    if (src) {
      const absolute = src.startsWith('//') ? `https:${src}` : src;
      if (!absolute.includes('autospajakarta.com')) continue; // skip gtag / pixel hosts
      assets.push({ kind: 'script', src: localise(absolute) });
      continue;
    }

    const code = tag.replace(/^<script[^>]*>/i, '').replace(/<\/script>$/i, '').trim();
    if (!code) continue;

    const type = tag.match(/\stype=["']([^"']+)["']/i)?.[1] ?? '';

    if (/application\/ld\+json/i.test(type)) {
      jsonLd = code;
      continue;
    }
    if (ANALYTICS.test(code)) continue;

    assets.push({ kind: 'inline', type, code });
  }

  const scripts = assets.filter((asset) => asset.kind === 'script').map((asset) => asset.src);
  const inlineScripts = assets
    .filter((asset) => asset.kind === 'inline')
    .map((asset) => asset.code);

  // --- body classes (Elementor scopes CSS on them) -------------------
  const bodyClass = live.match(/<body[^>]*class=["']([^"']+)["']/i)?.[1] ?? '';

  // --- content -------------------------------------------------------
  const html = localise(page.content.rendered);
  await writeFile(path.join(PAGES_OUT, `${slug}.html`), html);

  const description = text(page.excerpt?.rendered ?? '').slice(0, 300);

  manifest.push({
    slug,
    id: page.id,
    title: text(page.title.rendered),
    description,
    elementorId: page.id,
    bodyClass,
    stylesheets,
    scripts,
    inlineScripts,
    assets,
    jsonLd,
    canonical: `${SITE}/${slug}/`,
    categories: categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: text(c.name),
      count: c.count,
    })),
  });
  console.log(`manifest: ${slug}`);
}

const body = JSON.stringify(manifest, null, 2);

await writeFile(path.join(OUT, 'manifest.json'), body);

console.log(`\nwrote ${manifest.length} pages -> src/content/manifest.json`);
