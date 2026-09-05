/**
 * Animation presets and utilities for Framer Motion
 * Based on framer-motion-animator and motion-framer skills
 */

import type { Variants, Transition } from 'framer-motion';

// ============== TRANSITION PRESETS ==============

export const transitions = {
  /** Gentle spring - natural bounce */
  gentle: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 20,
  },

  /** Wobbly spring - playful */
  wobbly: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 10,
  },

  /** Stiff spring - snappy */
  stiff: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 30,
  },

  /** Slow spring - elegant */
  slow: {
    type: 'spring' as const,
    stiffness: 50,
    damping: 20,
  },

  /** Smooth tween */
  smooth: {
    type: 'tween' as const,
    duration: 0.3,
    ease: 'easeInOut' as const,
  },

  /** Snappy tween */
  snappy: {
    type: 'tween' as const,
    duration: 0.15,
    ease: [0.25, 0.1, 0.25, 1] as const,
  },
} as const;

// ============== VARIANT PRESETS ==============

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeDownVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeLeftVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
};

export const fadeRightVariants: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
};

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

export const scaleUpVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

// ============== STAGGER CONTAINERS ==============

export const staggerContainer = (
  staggerChildren: number = 0.1,
  delayChildren: number = 0
): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const staggerContainerSlow = (
  staggerChildren: number = 0.15,
  delayChildren: number = 0
): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

// ============== CARD HOVER VARIANTS ==============

export const cardHoverVariants: Variants = {
  rest: {
    scale: 1,
    transition: transitions.gentle,
  },
  hover: {
    scale: 1.02,
    transition: transitions.wobbly,
  },
  tap: {
    scale: 0.98,
    transition: transitions.snappy,
  },
};

export const buttonHoverVariants: Variants = {
  rest: {
    scale: 1,
    transition: transitions.gentle,
  },
  hover: {
    scale: 1.05,
    transition: transitions.wobbly,
  },
  tap: {
    scale: 0.95,
    transition: transitions.snappy,
  },
};

// ============== PAGE TRANSITION VARIANTS ==============

export const pageTransitionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: transitions.smooth,
  },
};

// ============== LAYOUT ANIMATIONS ==============

export const layoutTransition = {
  layout: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  },
} as const;

// ============== PARALLAX SETTINGS ==============

export const parallaxSettings = {
  yRange: [0, 50],
  opacityRange: [1, 0.5],
} as const;
