/**
 * Reusable animation components
 * Based on framer-motion-animator and motion-framer skills
 */

'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useMotionPreferences } from '@/lib/motion/hooks';

// ============== FADE IN ON VIEW ==============

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.6,
  direction = 'up',
}: FadeInProps) {
  const { shouldReduceMotion } = useMotionPreferences();

  const directionMap = {
    up: { y: 30 },
    down: { y: -30 },
    left: { x: 40 },
    right: { x: -40 },
    none: {},
  };

  const variants = {
    hidden: {
      opacity: 0,
      ...directionMap[direction],
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: shouldReduceMotion ? 0 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
    >
      {children}
    </motion.div>
  );
}

// ============== STAGGERED CONTAINER ==============

interface StaggeredListProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggeredList({
  children,
  className,
  staggerDelay = 0.1,
}: StaggeredListProps) {
  const { shouldReduceMotion } = useMotionPreferences();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
      },
    },
  };

  const itemVariants = {
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

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}

// ============== SCALE ON HOVER ==============

interface ScaleOnHoverProps {
  children: ReactNode;
  className?: string;
  scale?: number;
}

export function ScaleOnHover({
  children,
  className,
  scale = 1.05,
}: ScaleOnHoverProps) {
  const { shouldReduceMotion } = useMotionPreferences();

  return (
    <motion.div
      className={className}
      whileHover={shouldReduceMotion ? {} : { scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring' as const, stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.div>
  );
}

// ============== FLOATING ANIMATION ==============

interface FloatingProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export function Floating({
  children,
  className,
  intensity = 10,
}: FloatingProps) {
  const { shouldReduceMotion } = useMotionPreferences();

  const variants = {
    hidden: { y: 0 },
    visible: {
      y: [-intensity, intensity, -intensity],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={shouldReduceMotion ? {} : variants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

// ============== PULSE ANIMATION ==============

interface PulseProps {
  children: ReactNode;
  className?: string;
}

export function Pulse({ children, className }: PulseProps) {
  const { shouldReduceMotion } = useMotionPreferences();

  const variants = {
    hidden: { scale: 1, opacity: 1 },
    visible: {
      scale: [1, 1.02, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={shouldReduceMotion ? {} : variants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

// ============== GLOW EFFECT ==============

interface GlowEffectProps {
  children: ReactNode;
  className?: string;
  color?: string;
}

export function GlowEffect({
  children,
  className,
  color = 'rgba(39, 168, 223, 0.5)',
}: GlowEffectProps) {
  const { shouldReduceMotion } = useMotionPreferences();

  const variants = {
    hidden: { opacity: 0.3 },
    visible: {
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  return (
    <div className={`relative ${className}`}>
      {!shouldReduceMotion && (
        <motion.div
          className="absolute inset-0 blur-xl"
          style={{ backgroundColor: color }}
          variants={variants}
          initial="hidden"
          animate="visible"
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ============== SLIDE IN ==============

interface SlideInProps {
  children: ReactNode;
  className?: string;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
}

export function SlideIn({
  children,
  className,
  direction = 'up',
  delay = 0,
}: SlideInProps) {
  const { shouldReduceMotion } = useMotionPreferences();

  const directionMap = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { x: 60, y: 0 },
    right: { x: -60, y: 0 },
  };

  const variants = {
    hidden: { opacity: 0, ...directionMap[direction] },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 30,
        delay: shouldReduceMotion ? 0 : delay,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {children}
    </motion.div>
  );
}

// ============== BLUR IN ==============

interface BlurInProps {
  children: ReactNode;
  className?: string;
  blur?: number;
  delay?: number;
}

export function BlurIn({
  children,
  className,
  blur = 10,
  delay = 0,
}: BlurInProps) {
  const { shouldReduceMotion } = useMotionPreferences();

  const variants = {
    hidden: { opacity: 0, filter: `blur(${blur}px)` },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {children}
    </motion.div>
  );
}
