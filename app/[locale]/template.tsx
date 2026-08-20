'use client'

import { useLayoutEffect, useState } from 'react'
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
 * subsequent client-side navigation", and has to live at module scope
 * (rather than component state) because it must survive `<Template>`
 * itself unmounting and remounting on every route change.
 *
 * The previous version read that flag *during render* (`typeof window ===
 * 'undefined' || !hasMountedOnClient`) to decide which branch to return.
 * That guarantees the server always takes the no-animation branch, but
 * nothing guarantees the client's very first render of a given `<Template>`
 * instance takes the *same* branch the server did — a Fast Refresh reload,
 * a bfcache restore, or simply a second `<Template>` mount reusing an
 * already-warm module in the same tab can see `hasMountedOnClient` as
 * already `true` on a render React expects to match the server's HTML
 * exactly, producing a hydration mismatch (the wrapping `motion.div` shows
 * up where the server emitted the child directly).
 *
 * Moving the flip into `useLayoutEffect` removes that race structurally:
 * every render — server, and the client's first render of any given
 * mount — starts from the same `shouldAnimate = false` state, so the
 * markup is always identical at hydration time. Only *after* that render
 * has committed does the effect (browser-only, and never runs during SSR)
 * check the module flag and switch a later paint to the animated branch.
 * `useLayoutEffect` rather than `useEffect` so that flip happens before the
 * browser paints, avoiding a one-frame flash of unanimated content on
 * every subsequent navigation.
 */
let hasMountedOnClient = false

export default function Template({ children }: { children: React.ReactNode }) {
  const shouldReduce = useReducedMotion()
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useLayoutEffect(() => {
    if (hasMountedOnClient) setShouldAnimate(true)
    hasMountedOnClient = true
  }, [])

  if (shouldReduce || !shouldAnimate) return <>{children}</>

  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants}>
      {children}
    </motion.div>
  )
}
