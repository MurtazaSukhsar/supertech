'use client'

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react'

type RevealVariant =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'scale-up'
  | 'stagger-children'
  | 'clip-up'
  | 'rotate-in-3d'
  | 'blur-in'
  | 'typewriter'
  | 'swing-in'

interface ScrollRevealProps {
  children: ReactNode
  /** Delay in ms before the animation fires after entering viewport */
  delay?: number
  className?: string
  /** Animation variant — defaults to 'fade-up' */
  variant?: RevealVariant
  /** For stagger-children: delay between each child in ms (default 80) */
  staggerDelay?: number
  /** Custom duration in ms (default 600) */
  duration?: number
  /** IntersectionObserver threshold (default 0.05) */
  threshold?: number
}

export function ScrollReveal({
  children,
  delay = 0,
  className = '',
  variant = 'fade-up',
  staggerDelay = 80,
  duration = 600,
  threshold = 0.05,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay)
          } else {
            setIsVisible(true)
          }
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay, threshold])

  const style: CSSProperties = {
    '--reveal-duration': `${duration}ms`,
  } as CSSProperties

  return (
    <div
      ref={ref}
      className={`scroll-reveal scroll-reveal--${variant} ${isVisible ? 'is-visible' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
