'use client';

/**
 * The running headline of the About page.
 *
 * The Agntix template (`src/components/brand/AboutUsBrand.tsx`) runs a
 * marquee of the page title behind the fold - a single word repeated in
 * oversized, outlined letters. The template drives it with Swiper; here the
 * track is a CSS animation, so the headline keeps moving without a
 * JavaScript slider on the page.
 *
 * The brand colour of AutoSPA is the blue of the tokens, so the outline is
 * the primary colour at a low opacity.
 */

import styles from './AboutMarquee.module.css';

interface AboutMarqueeProps {
	/** The word that runs, e.g. "About Us". */
	text?: string;
	/** How many times the word is repeated. */
	repeats?: number;
	className?: string;
}

export function AboutMarquee({
	text = 'About Us',
	repeats = 6,
	className = '',
}: AboutMarqueeProps) {
	/* The track holds two identical halves; the animation moves it by half
	   its width, so the loop is seamless. */
	const items = Array.from({ length: repeats * 2 }, (_, index) => index);

	return (
		<div
			className={`relative overflow-hidden ${styles.mask} ${className}`}
			aria-hidden="true"
		>
			<div className={styles.track}>
				{items.map((index) => (
					<span key={index} className={styles.item}>
						{text}
					</span>
				))}
			</div>
		</div>
	);
}

export default AboutMarquee;
