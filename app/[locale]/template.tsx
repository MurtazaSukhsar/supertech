'use client'

import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

import { pageVariants } from '@/lib/motion'

/**
 * `template.tsx` re-mounts on every navigation (unlike `layout.tsx`, which
 * persists), which is exactly what a page transition needs — the header, footer
 * and quote basket stay mounted while the page content cross-fades.
 *
 * Skipping the fade on the very first mount
 * ------------------------------------------
 * `pageVariants` starts at `opacity: 0` and only reaches `opacity: 1` after
 * React hydrates and framer-motion runs the transition. That's invisible on
 * a fast connection, but on a throttled one (PageSpeed Insights tests on
 * "Slow 4G") the LCP element — the hero image on `/` — was measuring a
 * ~2.8s "element render delay" in Lighthouse's LCP breakdown: the image
 * itself downloaded in ~200ms, but sat behind this `opacity: 0` wrapper
 * until the JS bundle finished loading and hydrating. A cross-fade only
 * makes sense between two pages the visitor has already seen render — the
 * very first paint of a fresh tab has nothing to transition *from*, so it
 * should never be gated behind one.
 *
 * `hasMountedOnClient` distinguishes "first paint of this tab" from "a
 * subsequent client-side navigation". It's guarded by `typeof window` so
 * the server-rendered HTML (shared across every visitor's first request)
 * never mutates it — SSR always takes the no-animation branch, which also
 * means the initial HTML never ships hidden content, and hydration matches
 * exactly. Only once this module has already run once *in the browser* does
 * a later `<Template>` remount (i.e. an actual Link navigation) apply the
 * fade.
 */
let hasMountedOnClient = false

export default function Template({ children }: { children: React.ReactNode }) {
  const shouldReduce = useReducedMotion()
  const isFirstMountThisTab = useRef(
    typeof window === 'undefined' || !hasMountedOnClient,
  ).current

  if (typeof window !== 'undefined') hasMountedOnClient = true

  if (shouldReduce || isFirstMountThisTab) return <>{children}</>

  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants}>
      {children}
    </motion.div>
  )
}
