'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Stat counter - a number that counts up when it scrolls into view.
 *
 * Ported from the Agntix template's `AnimatedCounter`, which uses an
 * IntersectionObserver to start the count-up. The template's version is
 * driven by `setInterval`; this one eases the value instead, so it lands
 * exactly on the target number.
 */
export interface StatCounterProps {
	/** The number to count up to. */
	value: number;
	/** Text rendered after the number, e.g. `%` or `+`. */
	suffix?: string;
	/** Text rendered before the number. */
	prefix?: string;
	/** Label under the number. */
	label?: string;
	/** How long the count-up takes, in seconds. */
	duration?: number;
	className?: string;
}

export function StatCounter({
	value,
	suffix = '',
	prefix = '',
	label,
	duration = 1.6,
	className = '',
}: StatCounterProps) {
	const [display, setDisplay] = useState(0);
	const ref = useRef<HTMLSpanElement>(null);
	const started = useRef(false);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (!entry?.isIntersecting || started.current) return;

				started.current = true;

				const start = performance.now();
				const tick = (now: number) => {
					const progress = Math.min((now - start) / (duration * 1000), 1);
					// easeOutExpo, so the number decelerates into place.
					const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

					setDisplay(Math.round(value * eased));

					if (progress < 1) requestAnimationFrame(tick);
				};

				requestAnimationFrame(tick);
			},
			{ threshold: 0.4 },
		);

		observer.observe(node);

		return () => observer.disconnect();
	}, [value, duration]);

	return (
		<div className={className}>
			<span ref={ref} className="block text-4xl font-bold text-white md:text-5xl">
				{prefix}
				{display}
				{suffix}
			</span>
			{label ? <p className="mt-2 text-sm text-white/60">{label}</p> : null}
		</div>
	);
}
