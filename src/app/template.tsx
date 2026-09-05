'use client';

/**
 * Page template with Framer Motion transitions
 * Based on framer-motion-animator and motion-framer skills
 */

import { motion } from 'framer-motion';
import { useMotionPreferences } from '@/lib/motion/hooks';

export default function Template({ children }: { children: React.ReactNode }) {
  const { shouldReduceMotion } = useMotionPreferences();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 15,
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
