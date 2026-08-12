'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Scrolling uses the browser's native behavior (no custom smoothing library).
// This component just handles resetting scroll position on route change.
export function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo(0, 0)
    }, 50)
    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
