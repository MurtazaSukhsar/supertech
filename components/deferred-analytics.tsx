'use client'

import { useEffect } from 'react'

const GA_ID = 'G-XWX34YME25'
const INTERACTION_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const
const IDLE_FALLBACK_MS = 4000

/**
 * Loads Google Analytics (gtag.js) after the first user interaction, or
 * after a short idle fallback if the visitor never interacts.
 *
 * Why this exists: gtag.js alone is ~164 KiB, of which Lighthouse measures
 * ~68 KiB as unused JavaScript on first load — none of it is needed before
 * the page has painted. It previously loaded via next/script
 * (strategy="afterInteractive"), which still competes with the app's own
 * hydration for main-thread time right when TBT is measured. Deferring to
 * first interaction — with a short idle fallback so a visitor who never
 * interacts (reads the hero, leaves) is still counted — keeps every
 * pageview tracked while keeping it off the critical rendering path.
 */
export function DeferredAnalytics() {
  useEffect(() => {
    let loaded = false
    let fallback: ReturnType<typeof setTimeout> | null = null

    const load = () => {
      if (loaded) return
      loaded = true
      if (fallback) clearTimeout(fallback)
      INTERACTION_EVENTS.forEach((evt) => window.removeEventListener(evt, load))

      const script = document.createElement('script')
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
      script.async = true
      script.onload = () => {
        const w = window as unknown as { dataLayer: unknown[]; gtag: (...args: unknown[]) => void }
        w.dataLayer = w.dataLayer || []
        w.gtag = function gtag(...args: unknown[]) {
          w.dataLayer.push(args)
        }
        w.gtag('js', new Date())
        w.gtag('config', GA_ID)
      }
      document.head.appendChild(script)
    }

    INTERACTION_EVENTS.forEach((evt) =>
      window.addEventListener(evt, load, { once: true, passive: true }),
    )
    fallback = setTimeout(load, IDLE_FALLBACK_MS)

    return () => {
      INTERACTION_EVENTS.forEach((evt) => window.removeEventListener(evt, load))
      if (fallback) clearTimeout(fallback)
    }
  }, [])

  return null
}
