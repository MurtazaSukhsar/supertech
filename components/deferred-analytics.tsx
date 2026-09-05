'use client'

import { useEffect } from 'react'

const GA_ID = 'G-XWX34YME25'

/**
 * Loads Google Analytics (gtag.js) on mount, following Google's documented
 * bootstrap order exactly: define dataLayer + gtag and queue the 'js' and
 * 'config' commands FIRST, then inject the script tag. gtag.js only
 * processes commands that are already sitting in dataLayer by the time it
 * finishes initializing — queue them after the script loads (as a previous
 * version of this file did, inside script.onload) and the config call can
 * be silently dropped, because gtag.js has already taken over dataLayer.push
 * by then and the ordering guarantee is gone.
 *
 * This previously deferred loading until first interaction or a 4s idle
 * timeout, purely to shave ~68 KiB of unused JS off Lighthouse's first-load
 * measurement. That traded away correctness for a performance number:
 * Google's own tag-detection checker (Analytics admin > Data Streams > Test
 * your website) renders the page and checks almost immediately — it never
 * interacts or waits 4s — so it reported "Your Google tag wasn't detected
 * on your website" even though the code was live. Real visitors who bounce
 * in under 4 seconds without scrolling would have been missed the same way.
 * Loading eagerly (still async, still off the main render path) trades a
 * few KiB of deferred JS for actually-correct analytics — the right
 * tradeoff for a lead-gen B2B site that needs accurate traffic data.
 */
export function DeferredAnalytics() {
  useEffect(() => {
    const w = window as unknown as { dataLayer: unknown[]; gtag: (...args: unknown[]) => void }
    w.dataLayer = w.dataLayer || []
    w.gtag = function gtag(...args: unknown[]) {
      w.dataLayer.push(args)
    }
    // Queue these BEFORE the script loads — gtag.js reads whatever is
    // already in dataLayer when it initializes.
    w.gtag('js', new Date())
    w.gtag('config', GA_ID)

    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    script.async = true
    document.head.appendChild(script)
  }, [])

  return null
}
