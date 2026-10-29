/**
 * Extract the service data of the homepage services carousel.
 *
 * Usage: node scripts/sync/extract-services.mjs
 */

import { readFile, writeFile } from 'node:fs/promises';

const html = await readFile('src/content/pages/home.html', 'utf8');
const body = html.replace(/<script[\s\S]*?<\/script>/gi, '');

const SERVICES = [
  'Premium Wash',
  'Premium Detailing',
  'Premium Coating',
  'Premium 360° PPF',
  'Engine &amp; Glass',
  'Rust Protection',
];

function strip(value) {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/\s+/g, ' ')
    .trim();
}

const results = [];

for (const name of SERVICES) {
  const index = body.indexOf(`>${name}<`);
  if (index === -1) {
    console.log(`not found: ${name}`);
    continue;
  }

  // The card is a few kilobytes around the title.
  const region = body.slice(Math.max(0, index - 6000), index + 4000);

  const description = strip(
    region.match(/<p[^>]*>([\s\S]*?)<\/p>/gi)?.slice(-3).join(' ') ?? '',
  );
  const images = [...region.matchAll(/<img[^>]+src="([^"]+)"/gi)].map((match) => match[1]);
  const links = [...region.matchAll(/<a[^>]+href="([^"]+)"/gi)].map((match) => match[1]);
  const numbers = [...region.matchAll(/>\s*(\d{2})\s*</g)].map((match) => match[1]);

  results.push({
    name: strip(name),
    number: numbers[numbers.length - 1] ?? null,
    description: strip(description).slice(0, 400),
    images: images.slice(-3),
    links: links.slice(-3),
  });
}

console.log(JSON.stringify(results, null, 2));
await writeFile('.cache/services-home.json', JSON.stringify(results, null, 2));
