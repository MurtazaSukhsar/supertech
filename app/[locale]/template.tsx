'use client'

import { motion, useReducedMotion } from 'framer-motion'

import { pageVariants } from '@/lib/motion'

/**
 * `template.tsx` re-mounts on every navigation (unlike `layout.tsx`, which
 * persists), which is exactly what a page transition needs — the header, footer
 * and quote basket stay mounted while the page content cross-fades.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const shouldReduce = useReducedMotion()

  if (shouldReduce) return <>{children}</>

  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants}>
      {children}
    </motion.div>
  )
}
