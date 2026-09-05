/**
 * Reusable animation hooks using Framer Motion
 * Based on framer-motion-animator and motion-framer skills
 */

'use client';

import { useRef } from 'react';
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  type Variants,
  type Transition,
} from 'framer-motion';

// ============== USE ANIMATION IN VIEW ==============

interface UseFadeInOptions {
  variants?: Variants;
  transition?: Transition;
  once?: boolean;
  margin?: string;
}

export function useFadeIn(options: UseFadeInOptions = {}) {
  const {
    variants = {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 },
    },
    transition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    once = true,
    margin = '-50px',
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: margin as never });

  return {
    ref,
    variants,
    initial: 'hidden' as const,
    animate: isInView ? 'visible' : 'hidden',
    transition,
  };
}

// ============== USE STAGGER CHILDREN ==============

interface UseStaggerChildrenOptions {
  staggerChildren?: number;
  delayChildren?: number;
}

export function useStaggerChildren(
  ref: React.RefObject<HTMLElement | null>,
  options: UseStaggerChildrenOptions = {}
) {
  const {
    staggerChildren = 0.1,
    delayChildren = 0,
  } = options;

  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return {
    isInView,
    containerVariants,
    itemVariants,
    initial: 'hidden' as const,
    animate: isInView ? 'visible' : 'hidden',
  };
}

// ============== USE PARALLAX ==============

interface UseParallaxOptions {
  speed?: number;
  offset?: [number, number];
}

export function useParallax(options: UseParallaxOptions = {}) {
  const { speed = 0.5, offset = [0, 100] } = options;

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], offset);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  return { y: speed ? useTransform(scrollY, [0, 500], [0, 100 * speed]) : y, springY };
}

// ============== USE SCROLL PROGRESS ==============

export function useScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return { scrollYProgress, scaleX };
}

// ============== USE HOVER SCALE ==============

export function useHoverScale(intensity: number = 1.05) {
  const shouldReduceMotion = useReducedMotion();

  return {
    whileHover: shouldReduceMotion ? {} : { scale: intensity },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring' as const, stiffness: 400, damping: 17 },
  };
}

// ============== ANIMATED COUNTER ==============

interface UseAnimatedCounterOptions {
  target: number;
  duration?: number;
}

export function useAnimatedCounter({ target, duration = 2 }: UseAnimatedCounterOptions) {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();

  const motionValue = useTransform(
    scrollYProgress,
    [0, 1],
    [0, target]
  );

  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 30,
  });

  return { motionValue, springValue, shouldReduceMotion, duration };
}

// ============== REDUCED MOTION HOOK ==============

export function useMotionPreferences() {
  const shouldReduceMotion = useReducedMotion();

  const fadeTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.5 };

  const springTransition = shouldReduceMotion
    ? { type: 'spring' as const, stiffness: 700, damping: 40 }
    : { type: 'spring' as const, stiffness: 200, damping: 20 };

  return {
    shouldReduceMotion,
    fadeTransition,
    springTransition,
    staggerDelay: shouldReduceMotion ? 0 : 0.1,
  };
}

// ============== SCROLL REVEAL HOOK ==============

interface UseScrollRevealOptions {
  threshold?: number | 'some' | 'all';
  once?: boolean;
}

export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const { threshold = 0.3, once = true } = options;

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  return { ref, isInView };
}
