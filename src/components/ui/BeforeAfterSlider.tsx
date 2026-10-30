'use client';

/**
 * The before/after comparison slider.
 *
 * One photo of the vehicle before the work, the same photo after it, and a
 * divider in between that the visitor drags (or moves with the arrow keys)
 * to compare the two.
 *
 * The divider is one number - the percentage of the frame that shows the
 * photo from before the work. The hook `useBeforeAfterImageSlider` keeps
 * that number and hands it to the frame as the CSS variable `--ba-split`;
 * the photo from after the work is clipped to the rest of the frame by the
 * stylesheet of the component. Because the number is a percentage, a resize
 * of the window keeps the divider where the visitor put it.
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';
import type { CSSProperties } from 'react';

import { useBeforeAfterImageSlider } from '@/hooks/useBeforeAfterImageSlider';

import styles from './BeforeAfterSlider.module.css';

export interface BeforeAfterSliderProps {
	/** The photo before the work. */
	before: { src: string; alt: string; width: number; height: number };
	/** The photo after the work. */
	after: { src: string; alt: string; width: number; height: number };
	/** The label of the left half. */
	beforeLabel?: string;
	/** The label of the right half. */
	afterLabel?: string;
	/** Load the photos with the priority of the page. */
	priority?: boolean;
	/**
	 * How the photos are fetched.
	 *
	 * The gallery is a slider: the cards of the other pages stand outside
	 * the screen, and the browser does not always wake up for a photo that
	 * only moves into the screen through a transformation. The card that
	 * the visitor is looking at is therefore fetched right away.
	 */
	loading?: 'lazy' | 'eager';
	/** Called when the visitor touches the divider. */
	onInteract?: () => void;
	/** When this number changes, the divider goes back to the middle. */
	resetToken?: number;
	className?: string;
}

export function BeforeAfterSlider({
	before,
	after,
	beforeLabel = 'Before',
	afterLabel = 'After',
	priority = false,
	loading = 'lazy',
	onInteract,
	resetToken = 0,
	className = '',
}: BeforeAfterSliderProps) {
	const {
		position,
		frameRef,
		handleRef,
		onPointerDown,
		onPointerMove,
		onPointerUp,
		onPointerCancel,
		onKeyDown,
		reset,
	} = useBeforeAfterImageSlider();

	// A new slide starts in the middle again.
	useEffect(() => {
		reset();
	}, [reset, resetToken]);

	const rounded = Math.round(position);

	return (
		<div className={className}>
			<div
				ref={frameRef}
				onPointerDown={(event) => {
					onInteract?.();
					onPointerDown(event);
				}}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				onPointerCancel={onPointerCancel}
				className={`${styles.frame} aspect-square w-full overflow-hidden rounded-[24px] bg-background-7`}
				data-ba-frame
				style={{ '--ba-split': `${position}%` } as CSSProperties}
			>
				{/* The photo before the work - it fills the frame. */}
				<Image
					src={before.src}
					alt={before.alt}
					width={before.width}
					height={before.height}
					/* The photo is shown in a card of the gallery - three of them
					   stand next to each other on a wide screen, two on a tablet
					   and one on a phone. The sizes tell the optimiser how wide
					   the photo really is, so it does not send a full size one. */
					sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 92vw"
					priority={priority}
					loading={loading}
					className="absolute inset-0 size-full object-cover"
					draggable={false}
				/>

				{/* The photo after the work - the stylesheet clips it. */}
				<Image
					src={after.src}
					alt={after.alt}
					width={after.width}
					height={after.height}
					sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 92vw"
					priority={priority}
					loading={loading}
					className={`${styles.after} absolute inset-0 size-full object-cover`}
					data-ba-after
					draggable={false}
				/>

				{/* The divider. It is a slider of its own, so the keyboard can
				    move it and a screen reader can read where it stands. */}
				<div
					ref={handleRef}
					role="slider"
					tabIndex={0}
					aria-label="Drag to compare the before and after photos"
					aria-valuemin={0}
					aria-valuemax={100}
					aria-valuenow={rounded}
					aria-valuetext={`${rounded}% before, ${100 - rounded}% after`}
					onKeyDown={onKeyDown}
					className={styles.handle}
					data-ba-handle
				>
					<span className={styles.grip}>
						<ChevronLeft className="size-4" aria-hidden="true" />
						<ChevronRight className="-ml-2.5 size-4" aria-hidden="true" />
					</span>
				</div>

				{/* The labels of the two halves. */}
				<span className="pointer-events-none absolute top-4 left-4 z-10 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold tracking-[0.15em] text-white uppercase backdrop-blur-sm">
					{beforeLabel}
				</span>
				<span className="pointer-events-none absolute top-4 right-4 z-10 rounded-full bg-primary-500/90 px-3 py-1 text-xs font-semibold tracking-[0.15em] text-white uppercase backdrop-blur-sm">
					{afterLabel}
				</span>
			</div>
		</div>
	);
}

export default BeforeAfterSlider;
