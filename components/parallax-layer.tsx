'use client'

import React, { useEffect, useState, useRef } from 'react'

interface ParallaxLayerProps {
  children: React.ReactNode
  speed?: number // Speed factor, e.g., 0.2 means moves 20% of scroll speed
  className?: string
}

export function ParallaxLayer({ children, speed = 0.2, className = '' }: ParallaxLayerProps) {
  const [transformY, setTransformY] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', listener)

    let animationFrameId: number

    function handleScroll() {
      if (!ref.current || mediaQuery.matches) return
      
      const rect = ref.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      // Check if element is in viewport
      if (rect.top < viewportHeight && rect.bottom > 0) {
        // Calculate relative displacement from viewport center
        const scrollFactor = (rect.top + rect.height / 2) - (viewportHeight / 2)
        setTransformY(-scrollFactor * speed)
      }
    }

    function tick() {
      handleScroll()
      animationFrameId = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      mediaQuery.removeEventListener('change', listener)
      cancelAnimationFrame(animationFrameId)
    }
  }, [speed])

  const transformStyle = reducedMotion
    ? undefined
    : {
        transform: `translateY(${transformY}px)`,
        willChange: 'transform',
      }

  return (
    <div ref={ref} style={transformStyle} className={`transition-transform duration-100 ease-out ${className}`}>
      {children}
    </div>
  )
}
