'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const AUTO_SPEED = 0.09 // degrees per frame
const DRAG_SENSITIVITY = 0.35 // degrees per px of pointer travel

export function HeroProduct360() {
  const [rot, setRot] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [hovering, setHovering] = useState(false)

  const rotRef = useRef(0)
  const velRef = useRef(0)
  const lastXRef = useRef(0)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const on = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  // Auto-spin, plus inertia after a drag
  useEffect(() => {
    const tick = () => {
      if (!dragging) {
        if (Math.abs(velRef.current) > 0.01) {
          rotRef.current += velRef.current
          velRef.current *= 0.95
        } else if (!reduced && !hovering) {
          rotRef.current += AUTO_SPEED
        }
        setRot(rotRef.current)
      }
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [dragging, reduced, hovering])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    setDragging(true)
    lastXRef.current = e.clientX
    velRef.current = 0
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - lastXRef.current
      lastXRef.current = e.clientX
      const delta = dx * DRAG_SENSITIVITY
      rotRef.current += delta
      velRef.current = delta
      setRot(rotRef.current)
    },
    [dragging]
  )

  const endDrag = useCallback(() => setDragging(false), [])

  return (
    <div
      className="relative w-full select-none"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        role="img"
        aria-label="Super Tech product range: copper pipe, brass valves, ducting, clamps, fasteners and power tools. Drag to rotate."
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') velRef.current = -6
          if (e.key === 'ArrowRight') velRef.current = 6
        }}
        className={`relative ml-auto aspect-square w-full max-w-[760px] touch-pan-y outline-none ${
          dragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* centre glow behind the plate */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 size-[44%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-[90px]"
          aria-hidden="true"
        />

        <Image
          src="/images/hero-360.webp"
          alt=""
          fill
          sizes="(max-width: 1024px) 90vw, 760px"
          priority
          draggable={false}
          className="pointer-events-none select-none object-contain"
          style={{
            transform: `rotate(${rot}deg)`,
            filter: 'drop-shadow(0 24px 40px rgba(0,0,0,0.45))',
          }}
        />
      </div>
    </div>
  )
}
