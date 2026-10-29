/**
 * Dump the readable content of a mirrored page so it can be reviewed.
 *
 * Usage: node scripts/sync/dump-content.mjs <slug> [...]
 */

import { readFile } from 'node:fs/promises';

function decode(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'");
}

function text(value) {
  return decode(value.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

for (const slug of process.argv.slice(2)) {
  const html = await readFile(`src/content/pages/${slug}.html`, 'utf8');
  const body = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');

  console.log(`\n================ ${slug}`);

  const tokens = [
    ...body.matchAll(/<(h[1-6]|p|li|figcaption|span[^>]*class="[^"]*price[^"]*")[^>]*>([\s\S]*?)<\/\1>/gi),
  ];

  let last = '';
  for (const match of tokens) {
    const value = text(match[2]);
    if (!value || value === last) continue;
    last = value;
    console.log(`${match[1].toLowerCase().slice(0, 3)}: ${value.slice(0, 220)}`);
  }

  const images = [...new Set([...body.matchAll(/<img[^>]+src="([^"]+)"/gi)].map((m) => m[1]))];
  console.log('--- images');
  for (const image of images.slice(0, 25)) console.log('  ' + image);
}
