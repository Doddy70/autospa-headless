/**
 * Step 4 - Mirror the web fonts Elementor hosts.
 *
 * Elementor stores the Google fonts it uses as CSS files under
 * `uploads/elementor/google-fonts/css/<family>.css`, and every @font-face
 * points at `https://v2.autospajakarta.com/...` - a host that no longer
 * resolves, so the fonts silently fall back to a system font.
 *
 * The file names Elementor uses are `<family>-<hash>.woff2`, where `<hash>` is
 * the lowercased basename of the matching Google Fonts file. That makes the
 * mapping deterministic: fetch the family from the Google Fonts CSS API,
 * index the result by lowercased basename, and rewrite the local CSS to a
 * local copy of the file.
 *
 * Usage: node scripts/sync/fonts.mjs
 */

import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const FONT_DIR = path.resolve('public/wp-content/uploads/elementor/google-fonts/css');
const OUT_DIR = path.resolve('public/wp-content/fonts');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

let downloaded = 0;
let mapped = 0;
let skipped = 0;
const unmapped = new Set();

function familyFromSlug(slug) {
  return slug.replace(/\.css$/, '');
}

/** Collect the @font-face blocks of a font stylesheet. */
function parseBlocks(css) {
  return [...css.matchAll(/@font-face\s*\{([\s\S]*?)\}/g)].map((match) => {
    const block = match[1];
    const family = block.match(/font-family:\s*['"]([^'"]+)['"]/)?.[1] ?? '';
    const style = block.match(/font-style:\s*([a-z]+)/)?.[1] ?? 'normal';
    const weight = Number(block.match(/font-weight:\s*([\d.]+)/)?.[1] ?? '400');
    const src = block.match(/url\(([^)]+)\)/)?.[1] ?? '';
    const file = src.split('/').pop()?.split('?')[0] ?? '';
    return { family, style, weight, src, file };
  });
}

/**
 * Ask Google Fonts for a family and index the woff2 files by basename.
 *
 * Two APIs are consulted: the CSS2 API serves the variable font files (one per
 * unicode subset), the legacy API serves the static per-weight files. Which
 * one Elementor stored depends on the family, so both are indexed.
 */
async function googleFontIndex(family, hasItalic, weights) {
  const index = new Map();
  const ua = { headers: { 'User-Agent': UA } };

  const rangeAxes = [];
  if (weights.length) rangeAxes.push(`0,${Math.min(...weights)}..${Math.max(...weights)}`);
  if (hasItalic) rangeAxes.push(`1,${Math.min(...weights)}..${Math.max(...weights)}`);

  if (rangeAxes.length) {
    const query = `family=${encodeURIComponent(family)}:ital,wght@${rangeAxes.join(';')}&display=swap`;
    const res = await fetch(`https://fonts.googleapis.com/css2?${query}`, ua);
    if (res.ok) {
      for (const block of parseBlocks(await res.text())) {
        if (!block.file) continue;
        index.set(block.file.replace(/\.woff2$/i, '').toLowerCase(), block.src);
      }
    }
  }

  const staticWeights = [...new Set(weights)].sort((a, b) => a - b);
  if (staticWeights.length) {
    const list = staticWeights
      .flatMap((weight) => [`0,${weight}`, ...(hasItalic ? [`1,${weight}`] : [])])
      .join(';');
    const query = `family=${encodeURIComponent(family)}:ital,wght@${list}&display=swap`;
    const res = await fetch(`https://fonts.googleapis.com/css2?${query}`, ua);
    if (res.ok) {
      for (const block of parseBlocks(await res.text())) {
        if (!block.file) continue;
        index.set(block.file.replace(/\.woff2$/i, '').toLowerCase(), block.src);
      }
    }
  }

  return index.size ? index : null;
}

async function download(url, target) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, Buffer.from(await res.arrayBuffer()));
}

await mkdir(OUT_DIR, { recursive: true });

const files = (await readdir(FONT_DIR)).filter((file) => file.endsWith('.css'));

for (const file of files) {
  const filePath = path.join(FONT_DIR, file);
  const css = await readFile(filePath, 'utf8');
  const blocks = parseBlocks(css);

  const families = [...new Set(blocks.map((block) => block.family).filter(Boolean))];
  const hasItalic = blocks.some((block) => block.style === 'italic');
  const weights = [...new Set(blocks.map((block) => block.weight).filter((w) => Number.isFinite(w)))];

  let index = null;
  for (const family of families) {
    index = await googleFontIndex(family, hasItalic, weights);
    if (index && index.size) break;
  }

  if (!index) {
    console.log(`  ${file}: no Google Fonts match for ${families.join(', ')}`);
    skipped += 1;
    continue;
  }

  let rewritten = css;
  for (const block of blocks) {
    if (!block.file) continue;

    const hash = block.file.replace(/\.woff2$/i, '').toLowerCase();
    const lookup = hash.startsWith(`${familyFromSlug(file).toLowerCase()}-`)
      ? hash.slice(familyFromSlug(file).length + 1)
      : hash;

    const gstatic = index.get(lookup);
    if (!gstatic) {
      unmapped.add(block.file);
      continue;
    }

    const target = path.join(OUT_DIR, block.file);
    try {
      await download(gstatic, target);
      downloaded += 1;
    } catch (error) {
      console.log(`  ${block.file}: download failed (${error.message})`);
      continue;
    }

    rewritten = rewritten.split(block.src).join(`/wp-content/fonts/${block.file}`);
    mapped += 1;
  }

  await writeFile(filePath, rewritten);
  console.log(`${file}: ${mapped} mapped so far`);
}

console.log(`\nfonts: ${mapped} files mapped, ${downloaded} downloaded, ${skipped} stylesheets skipped`);
if (unmapped.size) {
  console.log(`unmapped (${unmapped.size}):`);
  for (const file of [...unmapped].slice(0, 15)) console.log(`  ${file}`);
}
