'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';

export interface UseBeforeAfterImageSliderOptions {
	/** Where the divider starts, in percent (0 = all before, 100 = all after). */
	initialPosition?: number;
	/** Called every time the divider moves, with the new percentage. */
	onPositionChange?: (percentage: number) => void;
	/** The size of one keyboard step, in percent. */
	step?: number;
}

/**
 * The drag of the before/after divider.
 *
 * The divider is a single number - the percentage of the frame that shows the
 * photo from before the work. The component puts that number into a CSS
 * variable (`--ba-split`), so the frame, the clipped photo and the handle
 * all follow it, and a resize of the window needs no recalculation at all.
 *
 * The drag is driven by the pointer events, so a mouse, a finger and a pen
 * all take the same path.
 */
export function useBeforeAfterImageSlider(
	options: UseBeforeAfterImageSliderOptions = {},
) {
	const { initialPosition = 50, onPositionChange, step = 5 } = options;

	const [position, setPosition] = useState(initialPosition);

	/** The frame the divider lives in. */
	const frameRef = useRef<HTMLDivElement>(null);
	/** The divider itself - it is the element the keyboard talks to. */
	const handleRef = useRef<HTMLDivElement>(null);

	/** True while the visitor holds the divider down. */
	const draggingRef = useRef(false);
	/** The callback of the caller, kept in a ref so it never restarts the drag. */
	const onChangeRef = useRef(onPositionChange);

	useEffect(() => {
		onChangeRef.current = onPositionChange;
	}, [onPositionChange]);

	/** Move the divider and tell the caller about it. */
	const apply = useCallback((next: number) => {
		const clamped = Math.min(100, Math.max(0, next));
		setPosition(clamped);
		onChangeRef.current?.(clamped);
	}, []);

	/** The percentage of the frame the given screen position stands for. */
	const percentageAt = useCallback((clientX: number) => {
		const frame = frameRef.current;
		if (!frame) return null;
		const rect = frame.getBoundingClientRect();
		if (rect.width === 0) return null;
		return ((clientX - rect.left) / rect.width) * 100;
	}, []);

	// The pointer goes down: the divider jumps to the finger and follows it.
	const onPointerDown = useCallback(
		(event: ReactPointerEvent<HTMLDivElement>) => {
			// Only the main button of the mouse drags the divider.
			if (event.pointerType === 'mouse' && event.button !== 0) return;

			const next = percentageAt(event.clientX);
			if (next === null) return;

			draggingRef.current = true;
			// The pointer is captured, so the drag survives a finger that
			// leaves the frame - and the page does not scroll under it.
			event.currentTarget.setPointerCapture?.(event.pointerId);
			apply(next);
		},
		[apply, percentageAt],
	);

	const onPointerMove = useCallback(
		(event: ReactPointerEvent<HTMLDivElement>) => {
			if (!draggingRef.current) return;
			const next = percentageAt(event.clientX);
			if (next === null) return;
			apply(next);
		},
		[apply, percentageAt],
	);

	const endDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
		if (!draggingRef.current) return;
		draggingRef.current = false;
		if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
			event.currentTarget.releasePointerCapture(event.pointerId);
		}
	}, []);

	// The keyboard moves the divider as well.
	const onKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			let next: number | null = null;

			switch (event.key) {
				case 'ArrowLeft':
				case 'ArrowDown':
					next = position - step;
					break;
				case 'ArrowRight':
				case 'ArrowUp':
					next = position + step;
					break;
				case 'PageDown':
					next = position - step * 2;
					break;
				case 'PageUp':
					next = position + step * 2;
					break;
				case 'Home':
					next = 0;
					break;
				case 'End':
					next = 100;
					break;
				default:
					return;
			}

			event.preventDefault();
			apply(next);
		},
		[apply, position, step],
	);

	return {
		/** The percentage the divider stands at. */
		position,
		/** The frame - the element that carries the pointer events. */
		frameRef,
		/** The divider - the element that takes the keyboard. */
		handleRef,
		onPointerDown,
		onPointerMove,
		onPointerUp: endDrag,
		onPointerCancel: endDrag,
		onKeyDown,
		/** Put the divider back where it started. */
		reset: useCallback(() => apply(initialPosition), [apply, initialPosition]),
	};
}

export default useBeforeAfterImageSlider;
