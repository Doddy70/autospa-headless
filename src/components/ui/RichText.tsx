import type { RichTextItem } from '@/content/structured/types';

/**
 * Rich text renderer for the structured page content.
 *
 * The legal pages (and the body copy of the other pages) are published as
 * prose with headings and lists. `scripts/sync/extract-static-content.mjs`
 * turns that markup into a typed list of items, which this component maps
 * onto the AutoSPA typography.
 */
export interface RichTextProps {
	items: RichTextItem[];
	className?: string;
}

export function RichText({ items, className = '' }: RichTextProps) {
	return (
		<div className={`space-y-5 ${className}`}>
			{items.map((item, index) => {
				if (item.type === 'heading') {
					const Tag = `h${Math.min(Math.max(item.level, 2), 4)}` as 'h2' | 'h3' | 'h4';

					return (
						<Tag
							key={index}
							className={
								item.level <= 2
									? 'pt-4 text-2xl font-bold text-white md:text-3xl'
									: 'pt-4 text-xl font-bold text-white md:text-2xl'
							}
						>
							{item.text}
						</Tag>
					);
				}

				if (item.type === 'list') {
					const ListTag = item.ordered ? 'ol' : 'ul';

					return (
						<ListTag
							key={index}
							className={`space-y-2 pl-6 text-base leading-relaxed text-white/70 break-words ${
								item.ordered ? 'list-decimal' : 'list-disc'
							} marker:text-primary-500`}
						>
							{item.items.map((entry) => (
								<li key={entry}>{entry}</li>
							))}
						</ListTag>
					);
				}

				return (
					<p key={index} className="text-base leading-relaxed text-white/70 break-words">
						{item.text}
					</p>
				);
			})}
		</div>
	);
}
