/**
 * Shared motion primitives.
 *
 * Two rules run through everything here:
 *
 * 1. **Direction flips in Arabic.** A panel that slides in from the right in
 *    English must slide in from the left in Arabic, or the motion fights the
 *    reading direction. Helpers that move along the x-axis take `isRtl`.
 *
 * 2. **Only transform and opacity.** `x`, `y`, `scale`, `rotate` and `opacity`
 *    are GPU-composited; animating `left`, `width` or `height` forces layout on
 *    every frame. The one deliberate exception is the mobile menu, which needs a
 *    real height animation — it's a single element and only runs on tap.
 *
 * `prefers-reduced-motion` is handled at the call site with `useReducedMotion()`
 * plus `reduce()` below, so motion collapses to a plain fade instead of vanishing
 * entirely.
 */
import type { Transition, Variants } from 'framer-motion'

/* ------------------------------------------------------------------ */
/* Easings and transitions                                             */
/* ------------------------------------------------------------------ */

/** Standard ease-out. Matches the CSS easing already used across the site. */
export const EASE_OUT = [0.21, 1, 0.21, 1] as const

/** Snappier curve for taps and small UI affordances. */
export const EASE_SNAP = [0.16, 1, 0.3, 1] as const

export const springSoft: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 30,
  mass: 0.9,
}

export const springPop: Transition = {
  type: 'spring',
  stiffness: 520,
  damping: 24,
  mass: 0.6,
}

export const tweenBase: Transition = {
  duration: 0.45,
  ease: EASE_OUT,
}

/* ------------------------------------------------------------------ */
/* Reduced motion                                                      */
/* ------------------------------------------------------------------ */

/**
 * Strip positional movement from a variant set, keeping opacity so content
 * still reads as "arriving" without any travel.
 */
export function reduce(variants: Variants, shouldReduce: boolean | null): Variants {
  if (!shouldReduce) return variants

  const stripped: Variants = {}
  for (const [key, value] of Object.entries(variants)) {
    if (typeof value !== 'object' || value === null) {
      stripped[key] = value
      continue
    }
    const { x, y, scale, rotate, rotateX, rotateY, ...rest } = value as Record<string, unknown>
    stripped[key] = { ...rest, transition: { duration: 0.2 } }
  }
  return stripped
}

/* ------------------------------------------------------------------ */
/* Direction-aware helpers                                             */
/* ------------------------------------------------------------------ */

/** Flip an x-offset so motion always travels with the reading direction. */
export function dirX(distance: number, isRtl: boolean): number {
  return isRtl ? -distance : distance
}

/** Slide-in panel (drawers, menus) anchored to the inline-end edge. */
export function panelVariants(isRtl: boolean): Variants {
  return {
    hidden: { x: dirX(32, isRtl), opacity: 0 },
    visible: { x: 0, opacity: 1, transition: springSoft },
    exit: { x: dirX(32, isRtl), opacity: 0, transition: { duration: 0.2, ease: EASE_OUT } },
  }
}

/* ------------------------------------------------------------------ */
/* Reusable variant sets                                               */
/* ------------------------------------------------------------------ */

/** Container that staggers its children. Pair with `staggerItem`. */
export function staggerContainer(stagger = 0.06, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren },
    },
    exit: {
      transition: { staggerChildren: 0.03, staggerDirection: -1 },
    },
  }
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_OUT } },
  exit: { opacity: 0, y: 4, transition: { duration: 0.15 } },
}

/**
 * Page-level transition — opacity only, on purpose.
 *
 * A `y` offset would look slightly nicer, but any transform on the page wrapper
 * makes it the containing block for `position: fixed` descendants and interferes
 * with the scroll-driven sticky sections (the featured-products deck runs a
 * 500vh sticky track). A fade costs nothing and can't break layout.
 */
export const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.28, ease: EASE_OUT } },
}

/** List rows that can be added or removed (quote basket items). */
export const listItemVariants: Variants = {
  hidden: { opacity: 0, height: 0, marginBottom: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.28, ease: EASE_OUT } },
  exit: { opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.2, ease: EASE_OUT } },
}

/** Card entering a filtered grid. */
export const gridItemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.28, ease: EASE_OUT } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.16 } },
}
