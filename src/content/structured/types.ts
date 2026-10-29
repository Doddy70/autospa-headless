/**
 * The typed shape of a structured page.
 *
 * `scripts/sync/extract-static-content.mjs` writes one JSON file per
 * mirrored production page into `src/content/structured/`. The native React
 * pages read those files instead of the raw Elementor markup, so the copy
 * stays exactly as published on autospajakarta.com.
 */

export type RichTextItem =
	| { type: 'heading'; level: number; text: string }
	| { type: 'paragraph'; text: string }
	| { type: 'list'; ordered: boolean; items: string[] };

export interface ImageItem {
	src: string;
	alt: string;
	width: number | null;
	height: number | null;
}

export interface ButtonItem {
	label: string;
	href: string;
}

export interface AccordionItemData {
	question: string;
	answer: string;
}

export interface CounterItem {
	value: string;
	label: string;
}

export interface TestimonialItem {
	quote: string;
	name: string;
	position: string;
}

export type PageBlock =
	| { type: 'heading'; level: number; text: string }
	| { type: 'paragraphs'; items: string[] }
	| { type: 'images'; items: ImageItem[] }
	| { type: 'buttons'; items: ButtonItem[] }
	| { type: 'accordion'; items: AccordionItemData[] }
	| { type: 'counters'; items: CounterItem[] }
	| { type: 'testimonials'; items: TestimonialItem[] }
	| { type: 'breadcrumbs' }
	| { type: 'richText'; items: RichTextItem[] };

export interface TeamMember {
	image: ImageItem;
	name: string;
	role: string;
}

export interface StructuredPage {
	slug: string;
	title: string;
	description: string;
	team: TeamMember[];
	counters: CounterItem[];
	blocks: PageBlock[];
}

/** Narrow a block list to a single type. */
export function blocksOfType<T extends PageBlock['type']>(
	blocks: PageBlock[],
	type: T,
): Extract<PageBlock, { type: T }>[] {
	return blocks.filter(
		(block): block is Extract<PageBlock, { type: T }> => block.type === type,
	);
}

/** All headings of a page, in document order. */
export function headingsOf(blocks: PageBlock[]): string[] {
	return blocksOfType(blocks, 'heading').map((block) => block.text);
}
