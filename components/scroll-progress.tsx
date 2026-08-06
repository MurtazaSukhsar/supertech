'use client'

import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'

import { useI18n } from '@/components/i18n-provider'

/**
 * Thin reading-progress bar pinned under the header.
 *
 * `scaleX` is used rather than `width` so the browser never re-runs layout while
 * scrolling. The transform origin is flipped in Arabic so the bar fills from the
 * right, matching the reading direction.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const shouldReduce = useReducedMotion()
  const { isRtl } = useI18n()

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  })

  // A springy progress bar is motion for its own sake; under reduced-motion
  // preferences track the scroll position directly instead.
  const progress = shouldReduce ? scrollYProgress : scaleX

  return (
    <motion.div
      aria-hidden="true"
      style={{
        scaleX: progress,
        transformOrigin: isRtl ? 'right center' : 'left center',
      }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] bg-accent"
    />
  )
}
