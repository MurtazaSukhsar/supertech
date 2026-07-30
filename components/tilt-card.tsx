'use client'

import React, { useState, useRef, useEffect } from 'react'

interface TiltCardProps {
  children: React.ReactNode
  className?: string
}

export function TiltCard({ children, className = '' }: TiltCardProps) {
  const [coords, setCoords] = useState({ rotateX: 0, rotateY: 0, isHovered: false })
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Disable tilt on touch devices
      setIsTouchDevice(navigator.maxTouchPoints > 0)
      
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReducedMotion(mediaQuery.matches)
      
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
      mediaQuery.addEventListener('change', listener)
      return () => mediaQuery.removeEventListener('change', listener)
    }
  }, [])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reducedMotion || isTouchDevice || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    // Cursor position relative to card center
    const mouseX = e.clientX - rect.left - width / 2
    const mouseY = e.clientY - rect.top - height / 2

    // Max 5 degrees tilt
    const maxTilt = 5
    const rotateX = -(mouseY / (height / 2)) * maxTilt
    const rotateY = (mouseX / (width / 2)) * maxTilt

    setCoords({ rotateX, rotateY, isHovered: true })
  }

  function handleMouseLeave() {
    setCoords({ rotateX: 0, rotateY: 0, isHovered: false })
  }

  // Double-layer premium spatial shadow: a tight contact shadow + a soft diffused shadow
  const hoverShadow = coords.isHovered
    ? '0 20px 40px -10px rgba(10, 36, 114, 0.22), 0 0 1px 1px rgba(217, 30, 42, 0.2)'
    : '0 4px 20px -6px rgba(10, 36, 114, 0.08)'

  const transformStyle = (reducedMotion || isTouchDevice)
    ? undefined
    : {
        transform: `perspective(1000px) rotateX(${coords.rotateX}deg) rotateY(${coords.rotateY}deg) translateY(${
          coords.isHovered ? '-6px' : '0px'
        }) scale(${coords.isHovered ? 1.025 : 1})`,
        boxShadow: hoverShadow,
        transition: coords.isHovered
          ? 'transform 100ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 300ms ease'
          : 'transform 450ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 300ms ease',
      }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={transformStyle}
      className={`relative h-full overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  )
}
