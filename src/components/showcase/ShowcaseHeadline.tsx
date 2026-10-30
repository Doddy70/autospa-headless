'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useRef, type ReactNode } from 'react';

import styles from './ShowcaseHeadline.module.css';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);

/**
 * The oversized two word headline of the Agntix portfolio metro block.
 *
 * What it does
 *   - the first word drifts to the left while the page scrolls
 *     (`tp-text-right-scroll`),
 *   - both words are revealed through a two tone gradient that scrolls across
 *     them (`tp_text_invert_2`).
 *
 * The gradient lives in the CSS module, on the lines SplitText creates - a
 * class on the span is not enough, the split lines are the elements that
 * carry the text.
 */

interface ShowcaseHeadlineProps {
	/** The word that drifts, e.g. "Layanan". */
	first: string;
	/** The second word, e.g. "Kami". */
	second: string;
	/** Optional slot next to the headline - the template puts the social
	 *  links there. */
	aside?: ReactNode;
	/** Optional line under the headline. */
	description?: string;
	/** Accessible label of the heading. */
	label?: string;
}

export default function ShowcaseHeadline({
	first,
	second,
	aside,
	description,
	label,
}: ShowcaseHeadlineProps) {
	const rootRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			const root = rootRef.current;
			if (!root) return;

			/* Every SplitText instance is kept so it can be reverted on
			   unmount - a split text that is not reverted keeps its own
			   wrappers and breaks the layout. */
			const splits: SplitText[] = [];

			if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

			const media = gsap.matchMedia();

			/* ───────────────────────────────────────────────
			 * The first word drifts to the left while the page
			 * scrolls.
			 * ─────────────────────────────────────────────── */
			media.add('(min-width: 991px)', () => {
				const rightElements = root.querySelectorAll('.tp-text-right-scroll');

				if (!rightElements.length) return;

				gsap
					.timeline({
						scrollTrigger: {
							trigger: root,
							start: 'top 100%',
							end: 'bottom top',
							scrub: true,
						},
					})
					.fromTo(
						rightElements,
						{ xPercent: 50 },
						{ xPercent: -20, ease: 'power1.out' },
						0,
					);
			});

			/* ───────────────────────────────────────────────
			 * The headline is revealed through a two tone
			 * gradient that scrolls across the words.
			 *
			 * SplitText does not read the scope of `useGSAP`, so the
			 * elements are collected from the section by hand.
			 * ─────────────────────────────────────────────── */
			root.querySelectorAll<HTMLElement>('.tp_text_invert_2').forEach((element) => {
				const split = new SplitText(element, { type: 'lines' });
				splits.push(split);

				split.lines.forEach((line) => {
					gsap.to(line, {
						backgroundPositionX: 0,
						ease: 'none',
						scrollTrigger: {
							trigger: line,
							scrub: 1,
							start: 'top 85%',
							end: 'bottom center',
						},
					});
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
		<div ref={rootRef} className="design-project-title-wrap relative mb-[60px] lg:mb-[120px]">
			<div className="grid items-end gap-y-10 lg:grid-cols-12">
				<div className="lg:col-span-9">
					<h2 className="design-project-title-box" aria-label={label}>
						<span className="tp-section-title-dirtyline block text-[60px] font-normal leading-[0.8] tracking-[-0.02em] text-white lg:text-[120px] xl:text-[140px] 2xl:text-[170px]">
							<span
								className={`tp-text-right-scroll tp_text_invert_2 ${styles.invert} inline-block`}
							>
								{first}
							</span>{' '}
							<br />
							<span className={`tp_text_invert_2 ${styles.invert} inline-block`}>{second}</span>
						</span>
					</h2>

					{description ? (
						<p className="tp_reveal_anim mt-8 max-w-[300px] text-lg font-medium leading-[1.25] tracking-[-0.02em] text-white/70 lg:max-w-[420px] lg:text-xl">
							{description}
						</p>
					) : null}
				</div>

				{aside ? <div className="lg:col-span-3">{aside}</div> : null}
			</div>
		</div>
	);
}
