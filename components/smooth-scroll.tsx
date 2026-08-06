'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'

export function SmoothScroll() {
  const pathname = usePathname()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.4, // Extra smooth, ultra-luxe scroll deceleration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      wheelMultiplier: 0.5, // 50% wheel speed for slow, steady, controlled scrolling
      touchMultiplier: 1.0, // Steady touch scrolling
      smoothWheel: true,
    })

    lenisRef.current = lenis
    // @ts-ignore - expose to window for external access
    window.lenis = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      lenisRef.current = null
      // @ts-ignore
      delete window.lenis
    }
  }, [])

  // Automatically scroll to the top of the page on route change
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo(0, 0)
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true })
      }
    }, 50)
    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
