'use client';

import { Quote } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { TestimonialItem } from '@/content/structured/types';

/**
 * Testimonial slider.
 *
 * The Agntix template and the production Elementor pages both use a
 * Swiper-based testimonial slider. This is a self-contained port of that
 * pattern: a horizontal track, arrow buttons and dots, without pulling in a
 * slider library.
 */
export interface TestimonialSliderProps {
	items: TestimonialItem[];
	className?: string;
}

export function TestimonialSlider({ items, className = '' }: TestimonialSliderProps) {
	const [index, setIndex] = useState(0);
	const [paused, setPaused] = useState(false);
	const trackRef = useRef<HTMLUListElement>(null);

	const goTo = useCallback(
		(next: number) => {
			setIndex(((next % items.length) + items.length) % items.length);
		},
		[items.length],
	);

	// Auto-advance, paused on hover and when the tab is hidden.
	useEffect(() => {
		if (paused || items.length < 2) return;

		const timer = setInterval(() => {
			if (document.visibilityState === 'visible') {
				setIndex((current) => (current + 1) % items.length);
			}
		}, 6000);

		return () => clearInterval(timer);
	}, [paused, items.length]);

	if (items.length === 0) return null;

	return (
		<div
			className={`relative ${className}`}
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
		>
			<div className="overflow-hidden">
				<ul
					ref={trackRef}
					className="flex transition-transform duration-500 ease-out"
					style={{ transform: `translateX(-${index * 100}%)` }}
				>
					{items.map((item) => (
						<li key={`${item.name}-${item.quote.slice(0, 12)}`} className="w-full shrink-0 px-1">
							<figure className="relative rounded-[20px] border border-white/10 bg-background-7 p-8 md:p-10">
								<Quote
									aria-hidden="true"
									className="absolute right-8 top-8 size-10 text-primary-500/15"
								/>

								<blockquote className="relative text-lg leading-relaxed text-white/85 md:text-xl">
									{item.quote}
								</blockquote>

								<figcaption className="mt-6 border-t border-white/10 pt-5">
									<span className="block font-semibold text-white">{item.name}</span>
									{item.position ? (
										<span className="mt-1 block text-sm text-primary-500">
											{item.position}
										</span>
									) : null}
								</figcaption>
							</figure>
						</li>
					))}
				</ul>
			</div>

			{items.length > 1 ? (
				<div className="mt-6 flex items-center justify-center gap-4">
					<button
						type="button"
						onClick={() => goTo(index - 1)}
						aria-label="Testimonial sebelumnya"
						className="grid size-10 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-primary-500 hover:text-primary-500"
					>
						<svg viewBox="0 0 448 512" className="size-3.5 fill-current" aria-hidden="true">
							<path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.7 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
						</svg>
					</button>

					<div className="flex items-center gap-2">
						{items.map((item, dot) => (
							<button
								key={`${item.name}-dot`}
								type="button"
								onClick={() => goTo(dot)}
								aria-label={`Testimonial ${dot + 1}`}
								aria-current={dot === index}
								className={`h-2 rounded-full transition-all ${
									dot === index ? 'w-6 bg-primary-500' : 'w-2 bg-white/20 hover:bg-white/40'
								}`}
							/>
						))}
					</div>

					<button
						type="button"
						onClick={() => goTo(index + 1)}
						aria-label="Testimonial berikutnya"
						className="grid size-10 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-primary-500 hover:text-primary-500"
					>
						<svg viewBox="0 0 448 512" className="size-3.5 fill-current" aria-hidden="true">
							<path d="M438.6 233.4c12.5-12.5 12.5-32.8 0-45.3l-192-192c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L370.7 256 201.3 425.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l192-192z" />
						</svg>
					</button>
				</div>
			) : null}
		</div>
	);
}
