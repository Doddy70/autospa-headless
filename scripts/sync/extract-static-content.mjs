/**
 * Extract structured content from the mirrored production pages.
 *
 * The production pages are Elementor layouts, so their markup is flat and
 * widget-based. This script walks the Elementor tree of every mirrored page
 * and turns it into a small, typed JSON shape (headings, paragraphs, images,
 * accordion items, buttons, stats, ...) that the native React pages render.
 *
 * It is READ ONLY: it reads `src/content/manifest.json` plus the mirrored
 * HTML under `src/content/pages/` and writes
 * `src/content/pages/<slug>.json`.
 *
 *   node scripts/sync/extract-static-content.mjs
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const PAGES_DIR = path.join(ROOT, 'src', 'content', 'pages');
const OUT_DIR = path.join(ROOT, 'src', 'content', 'structured');

/* ------------------------------------------------------------------ */
/* HTML helpers                                                        */
/* ------------------------------------------------------------------ */

const decodeEntities = (value) =>
  value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&hellip;/g, '…')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—');

const stripTags = (html) =>
  decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim();

const text = (html) => stripTags(html);

/* ------------------------------------------------------------------ */
/* Elementor tree                                                      */
/* ------------------------------------------------------------------ */

/** The `data-widget_type` of an Elementor chunk, if it has one. */
const widgetType = (chunk) => {
  const match = chunk.match(/data-widget_type="([^"]+)"/);
  return match ? match[1] : null;
};

/**
 * Find the index of the `</div>` that closes the `<div>` starting at
 * `openIndex`, by counting `<div>` / `</div>` pairs.
 *
 * Returns -1 when the markup is unbalanced.
 */
function findClosingDiv(html, openIndex) {
  const tagRe = /<(\/?)div\b[^>]*>/gi;
  tagRe.lastIndex = openIndex;

  let depth = 0;
  let match;

  while ((match = tagRe.exec(html)) !== null) {
    if (match[1]) {
      depth -= 1;
      if (depth === 0) return match.index + match[0].length;
    } else {
      depth += 1;
    }
  }

  return -1;
}

/* ------------------------------------------------------------------ */
/* Extractors                                                          */
/* ------------------------------------------------------------------ */

function extractHeadings(chunk) {
  const out = [];
  const re = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match;

  while ((match = re.exec(chunk)) !== null) {
    const value = text(match[2]);
    if (value) out.push({ level: Number(match[1]), text: value });
  }

  // Some Elementor widgets render the heading as a styled div instead of a
  // real heading element - `elementor-heading-title` and the theme's
  // `tcgelements-heading` both do this.
  const divRe = /<div[^>]*class="[^"]*(?:elementor-heading-title|tcgelements-heading)[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;

  while ((match = divRe.exec(chunk)) !== null) {
    const value = text(match[1]);
    if (value) out.push({ level: 2, text: value });
  }

  return out;
}

function extractParagraphs(chunk) {
  const out = [];
  const re = /<p\b[^>]*>([\s\S]*?)<\/p>/gi;
  let match;

  while ((match = re.exec(chunk)) !== null) {
    const value = text(match[1]);
    if (value) out.push(value);
  }

  return out;
}

function extractImages(chunk, baseUrl) {
  const out = [];
  const re = /<img\b[^>]*>/gi;
  let match;

  while ((match = re.exec(chunk)) !== null) {
    const tag = match[0];
    const src = (tag.match(/\bsrc="([^"]+)"/) || [])[1];
    if (!src) continue;

    const alt = decodeEntities((tag.match(/\balt="([^"]*)"/) || [])[1] || '');
    const width = Number((tag.match(/\bwidth="(\d+)"/) || [])[1]) || null;
    const height = Number((tag.match(/\bheight="(\d+)"/) || [])[1]) || null;

    // Elementor stores the real asset in data-src when lazy loading.
    const dataSrc = (tag.match(/\bdata-src="([^"]+)"/) || [])[1];
    const raw = dataSrc || src;

    out.push({
      src: toLocalPath(raw, baseUrl),
      alt,
      width,
      height,
    });
  }

  return out;
}

/**
 * Rewrite an upload URL to the locally mirrored copy.
 *
 * The mirror in `public/wp-content/**` keeps the original path, so the URL
 * only loses its origin. Assets that are not mirrored (the theme demo host
 * `hubfolio.themescamp.com`) keep their absolute URL - they are broken
 * upstream anyway.
 */
function toLocalPath(raw, baseUrl) {
  if (raw.startsWith('/')) return raw;

  const url = raw.startsWith('http') ? raw : new URL(raw, baseUrl).toString();

  const uploads = url.indexOf('/wp-content/uploads/');
  if (uploads === -1) return url;

  return url.slice(uploads);
}

function extractButtons(chunk, baseUrl) {
  const out = [];
  const re = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = re.exec(chunk)) !== null) {
    const attrs = match[1];
    const label = text(match[2]);
    const href = (attrs.match(/\bhref="([^"]+)"/) || [])[1];
    if (!href || !label) continue;
    if (href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:')) {
      out.push({ label, href });
      continue;
    }

    out.push({
      label,
      href: href.startsWith('http') ? href : new URL(href, baseUrl).toString(),
    });
  }

  return out;
}

/** Elementor's accordion widget: question in the button, answer in the body. */
function extractAccordion(chunk) {
  const out = [];
  const re =
    /<button[^>]*class="accordion-button[^"]*"[^>]*>([\s\S]*?)<\/button>[\s\S]*?<div class="accordion-body">([\s\S]*?)<\/div>/gi;
  let match;

  while ((match = re.exec(chunk)) !== null) {
    const question = text(match[1]);
    const answer = text(match[2]);
    if (question) out.push({ question, answer });
  }

  return out;
}

/**
 * Elementor's counter / progress widget: a number and the label next to it.
 */
function extractCounters(chunk) {
  const out = [];
  const re =
    /<span[^>]*class="[^"]*counter[^"]*"[^>]*>([\s\S]*?)<\/span>[\s\S]{0,400}?<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;

  while ((match = re.exec(chunk)) !== null) {
    const value = text(match[1]);
    const label = text(match[2]);
    if (value) out.push({ value, label });
  }

  return out;
}

/**
 * Extract the testimonials of a page.
 *
 * The theme renders them as `testi-card` slides: a quote, a name and a
 * position.
 */
function extractTestimonials(chunk) {
  const out = [];
  const re =
    /<div class="quote-text">[\s\S]*?<div>([\s\S]*?)<\/div>[\s\S]*?<h6 class="author-name">([\s\S]*?)<\/h6>[\s\S]*?<p class="author-position">([\s\S]*?)<\/p>/gi;
  let match;

  while ((match = re.exec(chunk)) !== null) {
    const quote = text(match[1]);
    const name = text(match[2]);
    const position = text(match[3]);

    if (quote && name) out.push({ quote, name, position });
  }

  return out;
}

/**
 * Extract rich text in document order: headings, paragraphs and list items.
 *
 * The legal pages are written as one long block of prose with `h3`/`h4`
 * section headings, so the order and the heading level both matter - a flat
 * list of paragraphs would lose the structure.
 */
function extractRichText(chunk) {
  const items = [];
  const re = /<(h[1-6]|p|ul|ol)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
  let match;

  while ((match = re.exec(chunk)) !== null) {
    const tag = match[1].toLowerCase();
    const body = match[3];

    if (tag === 'ul' || tag === 'ol') {
      const entries = [];
      const liRe = /<li\b[^>]*>([\s\S]*?)<\/li>/gi;
      let li;

      while ((li = liRe.exec(body)) !== null) {
        const value = text(li[1]);
        if (value) entries.push(value);
      }

      if (entries.length) items.push({ type: 'list', ordered: tag === 'ol', items: entries });
      continue;
    }

    const value = text(body);
    if (!value) continue;

    if (tag.startsWith('h')) {
      items.push({ type: 'heading', level: Number(tag[1]), text: value });
    } else {
      items.push({ type: 'paragraph', text: value });
    }
  }

  return items;
}

/* ------------------------------------------------------------------ */
/* Walk                                                                */
/* ------------------------------------------------------------------ */

/**
 * Collect every Elementor widget of a page, in document order.
 *
 * Rather than walking the container tree (Elementor nests `e-con-inner`
 * wrappers arbitrarily deep, which makes a recursive descent fragile), this
 * scans for the `data-element_type="widget"` marker and takes the balanced
 * `<div>...</div>` chunk that carries it.
 */
function findWidgets(html) {
  const widgets = [];
  const marker = /data-element_type="widget"/g;
  let match;

  while ((match = marker.exec(html)) !== null) {
    // The widget's own opening tag is the nearest `<div` before the marker.
    const openStart = html.lastIndexOf('<div', match.index);
    if (openStart === -1) continue;

    const closeEnd = findClosingDiv(html, openStart);
    if (closeEnd === -1) continue;

    widgets.push(html.slice(openStart, closeEnd));

    // Continue after this widget so nested widgets are not counted twice.
    marker.lastIndex = closeEnd;
  }

  return widgets;
}

/** A heading that is only a number, e.g. `7k+` or `98%`. */
const isNumericHeading = (value) => /^[\d.,]+\s*[kKmM+\-%]*$/.test(value.trim());

/**
 * Group the team members of a page.
 *
 * The team is a sequence of widgets - a photo, the person's name and their
 * role - one after the other. Walking the flat block list, a team member
 * starts at an image and takes the next two headings as name and role.
 */
function extractTeam(blocks) {
  const members = [];

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];

    if (block.type !== 'images' || block.items.length !== 1) continue;

    const name = blocks[index + 1];
    const role = blocks[index + 2];

    if (name?.type !== 'heading' || role?.type !== 'heading') continue;

    // A number followed by a label is a statistic, not a team member.
    if (isNumericHeading(name.text)) continue;

    members.push({
      image: block.items[0],
      name: name.text,
      role: role.text,
    });

    index += 2;
  }

  return members;
}

/**
 * Group the statistics of a page.
 *
 * The production pages show counters as a number heading followed by a label
 * heading ("7k+" / "Satisfaction Clients").
 */
function extractCountersFromBlocks(blocks) {
  const counters = [];

  for (let index = 0; index < blocks.length - 1; index += 1) {
    const value = blocks[index];
    const label = blocks[index + 1];

    if (value?.type !== 'heading' || label?.type !== 'heading') continue;
    if (!isNumericHeading(value.text)) continue;

    counters.push({ value: value.text, label: label.text.replace(/\s+/g, ' ').trim() });
    index += 1;
  }

  return counters;
}

/**
 * Read one Elementor widget and append its content to the accumulator.
 */
function readWidget(chunk, baseUrl, accumulator) {
  const type = widgetType(chunk);
  const headings = extractHeadings(chunk);
  const paragraphs = extractParagraphs(chunk);
  const images = extractImages(chunk, baseUrl);
  const buttons = extractButtons(chunk, baseUrl);

  if (type === 'tcgelements-accordion.default') {
    const items = extractAccordion(chunk);
    if (items.length) {
      accumulator.push({ type: 'accordion', items });
      return;
    }
  }

  if (type === 'tcgelements-counter.default' || /counter/i.test(type || '')) {
    const items = extractCounters(chunk);
    if (items.length) {
      accumulator.push({ type: 'counters', items });
      return;
    }
  }

  if (type === 'tcgelements-breadcrumbs.default') {
    accumulator.push({ type: 'breadcrumbs' });
    return;
  }

  if (/testimonial/i.test(type || '')) {
    const items = extractTestimonials(chunk);
    if (items.length) {
      accumulator.push({ type: 'testimonials', items });
      return;
    }
  }

  // The text-editor widget carries the body copy of a page. Rich text keeps
  // the heading structure, which the legal pages depend on.
  if (type === 'text-editor.default' || type === 'theme-page-title.default') {
    const rich = extractRichText(chunk);
    if (rich.length) {
      accumulator.push({ type: 'richText', items: rich });
      return;
    }
  }

  if (headings.length) {
    accumulator.push({ type: 'heading', level: headings[0].level, text: headings[0].text });
  }

  if (paragraphs.length) {
    accumulator.push({ type: 'paragraphs', items: paragraphs });
  }

  if (images.length) {
    accumulator.push({ type: 'images', items: images });
  }

  if (buttons.length) {
    accumulator.push({ type: 'buttons', items: buttons });
  }
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

const manifest = JSON.parse(
  await readFile(path.join(ROOT, 'src', 'content', 'manifest.json'), 'utf8'),
);

await mkdir(OUT_DIR, { recursive: true });

const baseUrl = process.env.WORDPRESS_SITE_URL || 'https://backend.autospajakarta.com';
const only = process.argv.slice(2).filter((arg) => !arg.startsWith('-'));

let written = 0;

for (const page of manifest) {
  if (only.length && !only.includes(page.slug)) continue;

  const file = path.join(PAGES_DIR, `${page.slug}.html`);
  let html;
  try {
    html = await readFile(file, 'utf8');
  } catch {
    console.warn(`[extract] skip ${page.slug} (no mirrored html)`);
    continue;
  }

  const blocks = [];
  const widgets = findWidgets(html);

  for (const widget of widgets) {
    readWidget(widget, baseUrl, blocks);
  }

  // Some pages (the cookie policy) are plain Gutenberg content without any
  // Elementor wrapper at all, so they yield no widgets. Fall back to reading
  // the markup as rich text.
  if (blocks.length === 0) {
    const rich = extractRichText(html);
    if (rich.length) blocks.push({ type: 'richText', items: rich });
  }

  const payload = {
    slug: page.slug,
    title: text(page.title?.rendered ?? page.title ?? ''),
    description: page.description ? text(page.description) : '',
    team: extractTeam(blocks),
    counters: extractCountersFromBlocks(blocks),
    blocks,
  };

  await writeFile(
    path.join(OUT_DIR, `${page.slug}.json`),
    `${JSON.stringify(payload, null, 2)}\n`,
    'utf8',
  );

  written += 1;
  console.log(`[extract] ${page.slug}: ${blocks.length} blocks`);
}

console.log(`[extract] wrote ${written} files to ${path.relative(ROOT, OUT_DIR)}`);
