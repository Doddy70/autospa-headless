'use client';

/**
 * The carousel of the before/after gallery.
 *
 * The gallery is a card slider: every card holds the comparison slider of
 * one detail of the vehicle - the photo from before the work, the photo
 * after it and the divider in between. Three cards stand next to each other
 * on a wide screen, two on a tablet and one on a phone; the arrows move the
 * gallery a page, the dots jump to a page, and the gallery moves on its own
 * when the visitor does not touch it.
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

import { BeforeAfterSlider } from '@/components/ui/BeforeAfterSlider';
import type { BeforeAfterItem } from '@/data/before-after';

/** How many cards stand next to each other, per width. */
const PER_VIEW = [
	{ query: '(min-width: 1280px)', count: 3 },
	{ query: '(min-width: 768px)', count: 2 },
	{ query: '(min-width: 0px)', count: 1 },
];

export interface BeforeAfterCarouselProps {
	/** The pairs of the gallery. */
	items: BeforeAfterItem[];
	/** The label of the left half. */
	beforeLabel?: string;
	/** The label of the right half. */
	afterLabel?: string;
	/** The time between two pages, in milliseconds. */
	autoplayMs?: number;
	className?: string;
}

export function BeforeAfterCarousel({
	items,
	beforeLabel = 'Before',
	afterLabel = 'After',
	autoplayMs = 6000,
	className = '',
}: BeforeAfterCarouselProps) {
	const [index, setIndex] = useState(0);
	const [paused, setPaused] = useState(false);
	const [onScreen, setOnScreen] = useState(true);
	/** How many cards fit on the screen at the current width. */
	const [perView, setPerView] = useState(1);
	/** Counts the pages that were shown - the divider starts over again. */
	const [resetToken, setResetToken] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);

	const count = items.length;

	/* The number of cards per page follows the width of the window. */
	useEffect(() => {
		const queries = PER_VIEW.map((entry) => window.matchMedia(entry.query));

		const update = () => {
			const found = PER_VIEW.find((entry, position) => queries[position]?.matches);
			setPerView(found?.count ?? 1);
		};

		update();
		for (const query of queries) query.addEventListener('change', update);
		return () => {
			for (const query of queries) query.removeEventListener('change', update);
		};
	}, []);

	/* The number of pages the gallery has, and the page the visitor is on. */
	const pages = Math.max(1, Math.ceil(count / perView));
	const page = Math.min(index, pages - 1);

	const goToPage = useCallback(
		(next: number) => {
			if (count === 0) return;
			const total = Math.max(1, Math.ceil(count / perView));
			setIndex(Math.min(Math.max(0, next), total - 1));
			setResetToken((token) => token + 1);
		},
		[count, perView],
	);

	// The carousel stops moving when it is not on screen - a gallery in the
	// middle of a long page must not keep the visitor busy in the background.
	useEffect(() => {
		const node = containerRef.current;
		if (!node || typeof IntersectionObserver === 'undefined') return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) setOnScreen(entry.isIntersecting);
			},
			{ threshold: 0.25 },
		);

		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	// The carousel moves on its own, paused on hover, on focus and when the
	// tab is hidden.
	useEffect(() => {
		if (paused || !onScreen || pages < 2 || autoplayMs <= 0) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const timer = setInterval(() => {
			if (document.visibilityState !== 'visible') return;
			setIndex((current) => (current + 1) % pages);
			setResetToken((token) => token + 1);
		}, autoplayMs);

		return () => clearInterval(timer);
	}, [paused, onScreen, pages, autoplayMs]);

	// The arrows of the carousel move the page too, but not while the
	// visitor is moving the divider of the comparison.
	const onKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
			// The divider is a slider of its own - it keeps the arrow keys.
			if ((event.target as HTMLElement).getAttribute('role') === 'slider') return;
			event.preventDefault();
			goToPage(page + (event.key === 'ArrowRight' ? 1 : -1));
		},
		[goToPage, page],
	);

	/* The cards of the page the visitor is on, and the cards of the page
	   that comes next - they are fetched right away, so a photo is never
	   missing when the visitor arrives at the page. */
	const visible = useMemo(() => items.slice(page * perView, page * perView + perView), [items, page, perView]);
	const comingNext = useMemo(
		() => items.slice((page + 1) * perView, (page + 1) * perView + perView),
		[items, page, perView],
	);

	if (count === 0) return null;

	return (
		<div
			ref={containerRef}
			className={`relative ${className}`}
			// The carousel is a focus stop of its own, so the arrow keys move
			// the page even when no button is pressed.
			tabIndex={0}
			role="group"
			aria-roledescription="carousel"
			aria-label="Before and after gallery"
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
			onFocusCapture={() => setPaused(true)}
			onBlurCapture={() => setPaused(false)}
			onKeyDown={onKeyDown}
		>
			<div className="relative">
				{/* The cards. Only the page that is on screen is shown. */}
				<div className="overflow-hidden">
					<ul
						className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
						style={{ transform: `translateX(-${page * 100}%)` }}
					>
						{items.map((item, slide) => (
							<li
								key={item.id}
								className="shrink-0 px-1.5 md:px-2.5"
								style={{ width: `${100 / perView}%` }}
								data-ba-slide
								// The cards that are not on screen must not be
								// reachable by keyboard.
								inert={!visible.some((shown) => shown.id === item.id)}
							>
								<BeforeAfterSlider
									before={item.before}
									after={item.after}
									beforeLabel={beforeLabel}
									afterLabel={afterLabel}
									/* Only the first card is fetched with the
									   priority of the page - the other ones are
									   loaded when the visitor reaches them. */
									priority={slide === 0}
									/* The card that is on screen - and the one that
									   comes next - are fetched right away: a photo
									   that only moves into the screen through the
									   slider is not always fetched by the browser. */
									loading={
										visible.some((shown) => shown.id === item.id) ||
										comingNext.some((shown) => shown.id === item.id)
											? 'eager'
											: 'lazy'
									}
									resetToken={resetToken}
									onInteract={() => setPaused(true)}
								/>

								{/* The name of the work and the line about it. */}
								<h3
									className="mt-5 text-center text-lg font-bold text-white md:text-xl"
									data-ba-title
								>
									{item.title}
								</h3>
								<p className="mt-2 text-center text-sm leading-relaxed text-white/70">
									{item.caption}
								</p>
							</li>
						))}
					</ul>
				</div>

				{/* The arrows of the carousel. */}
				{pages > 1 ? (
					<>
						<button
							type="button"
							onClick={() => goToPage(page - 1)}
							aria-label="Previous photo"
							className="absolute top-1/3 -left-3 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-background-8/85 text-white/80 backdrop-blur transition-colors hover:border-primary-500 hover:text-primary-500 md:-left-5"
						>
							<ChevronLeft className="size-5" aria-hidden="true" />
						</button>

						<button
							type="button"
							onClick={() => goToPage(page + 1)}
							aria-label="Next photo"
							className="absolute top-1/3 -right-3 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-background-8/85 text-white/80 backdrop-blur transition-colors hover:border-primary-500 hover:text-primary-500 md:-right-5"
						>
							<ChevronRight className="size-5" aria-hidden="true" />
						</button>
					</>
				) : null}
			</div>

			{/* The pages of the carousel. */}
			{pages > 1 ? (
				<div className="mt-8 flex items-center justify-center gap-2">
					{Array.from({ length: pages }, (_, dot) => (
						<button
							key={dot}
							type="button"
							onClick={() => goToPage(dot)}
							aria-label={`Page ${dot + 1}`}
							aria-current={dot === page}
							data-ba-dot
							className={`h-2 rounded-full transition-all ${
								dot === page ? 'w-6 bg-primary-500' : 'w-2 bg-white/20 hover:bg-white/40'
							}`}
						/>
					))}
				</div>
			) : null}

			<p className="mt-5 text-center text-xs text-white/40">
				{`${String(page + 1).padStart(2, '0')} / ${String(pages).padStart(2, '0')} - drag the divider, or use the arrow keys when the divider has the focus.`}
			</p>

			{/* What a screen reader hears when the page changes. */}
			<p aria-live="polite" className="sr-only">
				{`Page ${page + 1} of ${pages}: ${visible.map((item) => item.title).join(', ')}`}
			</p>
		</div>
	);
}

export default BeforeAfterCarousel;
