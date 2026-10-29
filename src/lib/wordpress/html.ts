/**
 * Helpers for the mirrored WordPress markup.
 */

/** Elements that never carry a closing tag. */
const VOID_ELEMENTS = new Set([
	'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
	'param', 'source', 'track', 'wbr',
]);

/**
 * Inline elements whose unclosed tags leak into the rest of the document.
 *
 * The production pages are published by Elementor and a few of them ship
 * unbalanced markup - `/about` for instance opens two `<b>` tags inside the
 * "Passion for Detail" headline and never closes them. The browser then
 * keeps those elements open until the end of the document, so they swallow
 * everything that follows - including the navigation and the footer of this
 * app, which breaks the hydration of the React tree.
 */
const INLINE_ELEMENTS = new Set([
	'b', 'strong', 'i', 'em', 'u', 's', 'strike', 'del', 'ins', 'mark', 'small',
	'sup', 'sub', 'code', 'kbd', 'samp', 'var', 'abbr', 'cite', 'q', 'span',
	'label', 'time', 'bdi', 'bdo', 'font', 'big', 'tt', 'acronym', 'dfn',
]);

/**
 * Closes the inline tags a mirrored page leaves open and drops the closing
 * tags that have no opening counterpart.
 *
 * The repair is appended at the end of the markup, so the visual result
 * stays the same as on production: an unclosed `<b>` still emphasises the
 * rest of the page, it just no longer escapes into the surrounding layout.
 */
export function balanceInlineTags(html: string): string {
	// The contents of <script> and <style> are code, not markup.
	const guarded = html.replace(
		/(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>)/gi,
		(match) => match.replace(/</g, '\u0000'),
	);

	const stack: string[] = [];
	/** The edits that repair the markup. */
	const edits: { start: number; end: number; text: string }[] = [];

	const tag = /<(\/?)([a-z][a-z0-9]*)\b[^>]*?(\/?)>/gi;
	let match: RegExpExecArray | null;

	while ((match = tag.exec(guarded)) !== null) {
		const [full, closing, rawName, selfClosing] = match;
		const name = (rawName ?? '').toLowerCase();

		if (VOID_ELEMENTS.has(name) || selfClosing === '/') continue;
		if (!INLINE_ELEMENTS.has(name)) continue;

		if (!closing) {
			stack.push(name);
			continue;
		}

		const open = stack.lastIndexOf(name);
		if (open === -1) {
			// A closing tag without an opening one - drop it.
			edits.push({ start: match.index, end: match.index + full.length, text: '' });
			continue;
		}

		// The tags that are still open inside this one are closed here.
		const inner = stack.splice(open + 1).reverse();
		if (inner.length) {
			edits.push({
				start: match.index,
				end: match.index,
				text: inner.map((inner) => `</${inner}>`).join(''),
			});
		}
		stack.pop();
	}

	// Whatever is still open is closed at the end of the markup.
	const closers = stack.reverse().map((name) => `</${name}>`).join('');

	if (!edits.length && !closers) return html;

	let repaired = guarded;
	for (const edit of edits.sort((a, b) => b.start - a.start)) {
		repaired = repaired.slice(0, edit.start) + edit.text + repaired.slice(edit.end);
	}

	return repaired.replace(/\u0000/g, '<') + closers;
}
