import { readFile } from 'node:fs/promises';

/**
 * Compares a mirrored production page with the page the local frontend
 * serves.
 *
 * The comparison runs on the Elementor body of both documents, so the theme
 * header and footer of production are ignored - what is compared is the
 * content: the copy, the headings and the images.
 *
 *   node scripts/sync/compare-page.mjs about
 *   node scripts/sync/compare-page.mjs about https://autospajakarta.com/about/
 */

const slug = process.argv[2] ?? 'about';
const prodUrl = process.argv[3] ?? `${process.env.WORDPRESS_SITE_URL ?? 'https://backend.autospajakarta.com'}/${slug}/`;
const localUrl = process.argv[4] ?? `http://localhost:3200/${slug}`;

const decode = (value) =>
	value
		.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
		.replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&quot;/g, '"')
		.replace(/&#039;|&apos;/g, "'")
		.replace(/&hellip;/g, '…')
		.replace(/&ndash;/g, '–')
		.replace(/&mdash;/g, '—')
		.replace(/&rsquo;/g, '’')
		.replace(/&lsquo;/g, '‘')
		.replace(/&ldquo;|&rdquo;/g, '"');

const stripTags = (html) =>
	decode(html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' '))
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

/** Extracts the Elementor page body - the part that holds the content. */
function elementorBody(html) {
	const marker = 'data-elementor-type="wp-page"';
	const at = html.indexOf(marker);
	if (at === -1) return html;

	const start = html.lastIndexOf('<div', at);
	let depth = 0;
	const tag = /<\/?div\b/g;
	tag.lastIndex = start;

	let match;
	while ((match = tag.exec(html)) !== null) {
		const isClose = html[match.index + 1] === '/';
		const isSelfClosing = html[match.index] === '<' && html[html.indexOf('>', match.index) - 1] === '/';
		if (isClose) {
			depth -= 1;
			if (depth === 0) return html.slice(start, match.index + 6);
		} else if (!isSelfClosing) {
			depth += 1;
		}
	}

	return html.slice(start);
}

function headings(html) {
	return [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)]
		.map((match) => stripTags(match[2]))
		.filter(Boolean);
}

function images(html) {
	return [...new Set([...html.matchAll(/<img[^>]+src="([^"]+)"/gi)].map((match) => match[1]))]
		.map((src) => src.replace(/^https?:\/\/[^/]+/, '').split('?')[0])
		.filter((src) => src.includes('/uploads/'));
}

function paragraphs(html) {
	return [...html.matchAll(/<(p|h[1-6]|li)[^>]*>([\s\S]*?)<\/\1>/gi)]
		.map((match) => stripTags(match[2]))
		.filter((text) => text.length > 1);
}

const [prodHtml, localHtml] = await Promise.all([
	fetch(prodUrl, { redirect: 'follow' }).then((response) => response.text()),
	fetch(localUrl, { redirect: 'follow' }).then((response) => response.text()),
]);

const prod = elementorBody(prodHtml);
const local = elementorBody(localHtml);

const report = {
	slug,
	production: prodUrl,
	local: localUrl,
	productionTextLength: stripTags(prod).length,
	localTextLength: stripTags(local).length,
};

const prodText = stripTags(prod);
const localText = stripTags(local);
report.textIdentical = prodText === localText;
if (!report.textIdentical) {
	let index = 0;
	while (index < Math.min(prodText.length, localText.length) && prodText[index] === localText[index]) index += 1;
	report.firstDifference = {
		at: index,
		production: prodText.slice(Math.max(0, index - 80), index + 160),
		local: localText.slice(Math.max(0, index - 80), index + 160),
	};
}

const prodHeadings = headings(prod);
const localHeadings = headings(local);
report.headings = {
	production: prodHeadings.length,
	local: localHeadings.length,
	identical: JSON.stringify(prodHeadings) === JSON.stringify(localHeadings),
	missingLocally: prodHeadings.filter((heading) => !localHeadings.includes(heading)),
	extraLocally: localHeadings.filter((heading) => !prodHeadings.includes(heading)),
};

const prodImages = images(prod);
const localImages = images(local);
report.images = {
	production: prodImages.length,
	local: localImages.length,
	missingLocally: prodImages.filter((src) => !localImages.includes(src)),
	extraLocally: localImages.filter((src) => !prodImages.includes(src)),
};

const prodParagraphs = paragraphs(prod);
const localParagraphs = new Set(paragraphs(local));
report.copy = {
	productionBlocks: prodParagraphs.length,
	missingLocally: prodParagraphs.filter((text) => !localParagraphs.has(text)),
};

console.log(JSON.stringify(report, null, 2));

const ok = report.textIdentical && report.headings.identical && report.images.missingLocally.length === 0;
console.log(ok ? '\nMATCH: the local page serves the production content.' : '\nDIFFERENT: see the report above.');
process.exit(ok ? 0 : 1);
