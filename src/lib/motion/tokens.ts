/**
 * Motion tokens.
 *
 * Same contract as the colour tokens in globals.css: a component never inlines
 * a spring or a duration, it references a preset here. The values are lifted
 * from the Framer reference export in `html_framer/` (its
 * `__framer__appearAnimationsContent` payload) so the rebuilt frontend keeps
 * the original motion character - a soft spring settling downward with a small
 * overshoot - without inheriting Framer's timing.
 *
 * FRAMER_ORIGINAL records what that export actually shipped. A 1s delay before
 * a 1.9s settle reads well in a design tool and costs real Largest Contentful
 * Paint on a phone, because Chrome does not count an element at opacity 0 as
 * painted. The presets below keep the shape (spring, bounce 0.2) and roughly
 * halve the time. Swap FRAMER_ORIGINAL back in if the slower feel is wanted.
 */

import type { Transition } from 'framer-motion';

/** Verbatim from html_framer/index.html - kept for provenance, not used. */
export const FRAMER_ORIGINAL: Record<'hero' | 'secondary', Transition> = {
  hero: { type: 'spring', bounce: 0.2, delay: 1, duration: 1.9 },
  secondary: { type: 'spring', bounce: 0.2, delay: 2.3, duration: 1.4 },
};

export const SPRING: Record<'entrance' | 'reveal' | 'hover', Transition> = {
  /** Above-the-fold mount. Short, because it gates LCP. */
  entrance: { type: 'spring', bounce: 0.2, duration: 0.85 },
  /** Scroll-triggered band. Slightly calmer overshoot than the hero. */
  reveal: { type: 'spring', bounce: 0.18, duration: 0.7 },
  /** Pointer feedback. Stiff enough to feel attached to the cursor. */
  hover: { type: 'spring', stiffness: 320, damping: 26 },
};

export const OFFSET = {
  /** Framer's scroll-reveal offset, used verbatim. */
  reveal: 33,
  /**
   * Hero drops in from above. Framer used -150, which on a 667px viewport
   * starts the heading off-screen and reads as a layout jump rather than an
   * entrance.
   */
  hero: -64,
  /** Hover lift for cards. */
  lift: -6,
} as const;

export const STAGGER = {
  children: 0.08,
  /** Deliberately near-zero: the first child is usually the LCP element. */
  delayChildren: 0.04,
} as const;

/**
 * Viewport trigger for scroll reveals.
 *
 * `amount: 'some'` with a negative bottom margin rather than a percentage of
 * the element: a band taller than roughly five viewports can never satisfy a
 * percentage threshold, and would stay at opacity 0 permanently.
 */
export const VIEWPORT = {
  once: true,
  amount: 'some',
  margin: '0px 0px -12% 0px',
} as const;
