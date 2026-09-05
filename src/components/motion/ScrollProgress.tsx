'use client';

/**
 * Scroll progress indicator
 * Based on framer-motion-animator and motion-framer skills
 */

import { motion, useScroll, useSpring } from 'framer-motion';
import { useMotionPreferences } from '@/lib/motion/hooks';

export function ScrollProgress() {
  const { shouldReduceMotion } = useMotionPreferences();
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary z-50 origin-left"
      style={{ scaleX }}
    />
  );
}
