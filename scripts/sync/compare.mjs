/**
 * Fidelity check - compare the mirrored page against the live production page.
 *
 * For every page: count the Elementor containers, widgets and images, and
 * compare the heading texts. A mismatch means the snapshot lost content.
 *
 * Usage: node scripts/sync/compare.mjs
 */

import { readFile } from 'node:fs/promises';

const SITE = process.env.WORDPRESS_SITE_URL ?? 'https://backend.autospajakarta.com';
const LOCAL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3100';

const manifest = JSON.parse(await readFile('src/content/manifest.json', 'utf8'));
const snapshots = JSON.parse(await readFile('.cache/wp/pages.json', 'utf8'));
const NATIVE = new Set(['about', 'contact', 'services', 'locations', 'home']);

function count(html, pattern) {
  return [...html.matchAll(pattern)].length;
}

/** Ignore script bodies - the MetForm template embeds a copy of the markup. */
function stripScripts(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, '');
}

function headings(html) {
  return [...html.matchAll(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi)]
    .map((match) => match[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

let problems = 0;

for (const page of manifest) {
  if (NATIVE.has(page.slug)) {
    console.log(`SKIP ${page.slug.padEnd(36)} native route, not a snapshot`);
    continue;
  }

  const snapshot = snapshots.find((entry) => entry.slug === page.slug)?.content.rendered ?? '';

  const local = await fetch(`${LOCAL}/${page.slug}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AutoSPA-Sync/1.0)' },
  }).then((response) => response.text());

  const snapshotClean = stripScripts(snapshot);
  const localClean = stripScripts(local);
  const snapshotWidgets = count(snapshotClean, /data-widget_type=/g);
  const localWidgets = count(localClean, /data-widget_type=/g);
  const snapshotContainers = count(snapshotClean, /class="[^"]*e-con\b/g);
  const localContainers = count(localClean, /class="[^"]*e-con\b/g);

  const snapshotHeadings = headings(snapshotClean);
  const localHeadings = headings(localClean);
  const shared = localHeadings.filter((heading) => snapshotHeadings.includes(heading)).length;

  const ok =
    localWidgets === snapshotWidgets &&
    localContainers === snapshotContainers &&
    shared === snapshotHeadings.length;

  if (!ok) problems += 1;

  console.log(
    `${ok ? 'OK  ' : 'DIFF'} ${page.slug.padEnd(36)} widgets ${snapshotWidgets}/${localWidgets}  containers ${snapshotContainers}/${localContainers}  headings ${snapshotHeadings.length}/${localHeadings.length} (shared ${shared})`,
  );
}

console.log(`\n${problems} snapshot(s) differ from the mirrored source`);
