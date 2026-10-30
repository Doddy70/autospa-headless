'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

import type { ServiceCard } from '@/lib/services/types';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);

/**
 * The Agntix portfolio metro rows, turned into the service catalogue.
 *
 * The template block is `src/components/project/PortfolioMertoProject.tsx`
 * of the Agntix source. What is kept:
 *
 *   - the alternating rows - photo on one side, copy on the other - with the
 *     photo sliding in from the side and straightening up as the row enters
 *     the viewport (`item-1` / `item-2`),
 *   - the row title revealed character by character,
 *   - the outlined call to action.
 *
 * What is different from the template:
 *
 *   - the rows are services, not projects, and they are read from the
 *     service catalogue (`lib/services/catalog`) instead of a hardcoded
 *     array,
 *   - the Bootstrap grid and the SCSS are Tailwind utilities and one CSS
 *     module,
 *   - the animations are scoped to this component and are reverted when it
 *     unmounts - the template leaves its SplitText instances and
 *     ScrollTriggers behind.
 */

interface ShowcaseRowsProps {
	/** The catalogue rows to render. */
	items: ServiceCard[];
	/** Label of the call to action button. */
	ctaLabel?: string;
	/** Accessible name of the list. */
	label?: string;
}

/**
 * Splits a title after its first word, the way the template's
 * `hasLineBreak` does.
 */
function splitTitle(title: string, hasLineBreak: boolean) {
	if (!hasLineBreak) return title;

	const [first, ...rest] = title.split(' ');

	return (
		<>
			{first} <br /> {rest.join(' ')}
		</>
	);
}

/**
 * One row - photo and copy.
 */
function ShowcaseRow({ item, index }: { item: ServiceCard; index: number }) {
	/* The template swaps the two columns when the row is laid out "left". */
	const photoOnRight = item.layout === 'left';

	return (
		<div className="mb-[70px] last:mb-0 lg:mb-[120px]">
			<div className="grid items-center gap-y-10 lg:grid-cols-12 lg:gap-x-[60px]">
				{/* Photo column */}
				<div className={`lg:col-span-7 ${photoOnRight ? 'lg:order-2' : 'lg:order-1'}`}>
					<div
						/* The class picks the entrance direction of the photo,
						   exactly like the template's
						   `.design-project-thumb.item-1 / .item-2`. */
						className={`design-project-thumb item-${index % 2 === 0 ? '1' : '2'} ${
							photoOnRight ? 'text-end' : ''
						}`}
					>
						<Image
							src={item.image}
							alt={item.alt}
							width={652}
							height={449}
							className="h-auto w-full rounded-[30px] will-change-transform"
						/>
					</div>
				</div>

				{/* Copy column */}
				<div className={`lg:col-span-5 ${photoOnRight ? 'lg:order-1' : 'lg:order-2'}`}>
					<div className="design-project-content xl:pl-[100px]">
						{item.number ? (
							<span className="tp_reveal_anim mb-4 block text-sm font-semibold tracking-[0.2em] text-primary-500">
								{item.number}
							</span>
						) : null}

						<h3 className="tp_reveal_anim text-[34px] font-normal leading-[0.95] tracking-[-0.02em] text-white lg:text-[54px]">
							<Link href={item.href}>{splitTitle(item.title, item.hasLineBreak)}</Link>
						</h3>

						<span className="tp_reveal_anim mt-3 block text-lg font-medium leading-none tracking-[-0.02em] text-white/60 lg:mt-[45px] lg:text-xl">
							{item.subtitle}
						</span>

						<Link
							href={item.href}
							className="tp-btn-sky-border mt-8 inline-block rounded-full border-[1.5px] border-primary-500/60 px-9 py-4 text-base font-semibold leading-none tracking-[-0.02em] text-primary-300 transition-colors duration-300 hover:bg-primary-500 hover:text-white lg:mt-11"
						>
							See Detail
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * The service rows.
 */
export default function ShowcaseRows({
	items,
	label = 'Our Services',
}: ShowcaseRowsProps) {
	const rootRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			const root = rootRef.current;
			if (!root) return;

			/* Every SplitText instance is kept so it can be reverted on
			   unmount - a split text that is not reverted keeps its own
			   wrappers and breaks the layout. */
			const splits: SplitText[] = [];

			/* Visitors who asked the browser for less motion get the rows
			   without the scroll choreography: the content stays, only the
			   movement goes. */
			if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

			/* ───────────────────────────────────────────────
			 * The photo slides in from the side and straightens
			 * up while the row moves through the viewport.
			 * ─────────────────────────────────────────────── */
			const media = gsap.matchMedia();

			media.add('(min-width: 991px)', () => {
				gsap.set('.design-project-thumb.item-1', { x: 400, rotate: 10 });
				gsap.set('.design-project-thumb.item-2', { x: -400, rotate: -10 });

				gsap.utils.toArray<HTMLElement>('.design-project-item').forEach((row) => {
					/* Every row carries exactly one of the two classes, so
					   only the thumb that is actually there is animated. */
					const thumb = row.querySelector('.design-project-thumb');
					if (!thumb) return;

					gsap
						.timeline({
							scrollTrigger: {
								trigger: row,
								start: 'top 100%',
								end: 'bottom center',
								scrub: 1,
							},
						})
						.to(thumb, { x: 0, rotate: 0 });
				});
			});

			/* ───────────────────────────────────────────────
			 * The row title appears character by character.
			 * ─────────────────────────────────────────────── */
			root.querySelectorAll<HTMLElement>('.tp_reveal_anim').forEach((element) => {
				const titleSplit = new SplitText(element, {
					type: 'lines,words,chars',
					linesClass: 'tp-reveal-line',
				});
				splits.push(titleSplit);

				gsap.from(titleSplit.chars, {
					duration: 1.5,
					delay: 0.05,
					ease: 'circ.out',
					y: 80,
					stagger: 0.02,
					opacity: 0,
					scrollTrigger: {
						trigger: element,
						start: 'top 85%',
					},
				});
			});

			return () => {
				media.revert();
				splits.forEach((split) => split.revert());
			};
		},
		{ scope: rootRef },
	);

	return (
		<div
			ref={rootRef}
			id="top"
			className="design-project-item-wrap"
			aria-label={label}
		>
			{items.map((item, index) => (
				<div key={item.slug} className="design-project-item">
					<ShowcaseRow item={item} index={index} />
				</div>
			))}
		</div>
	);
}
