'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Image } from '@/components/site-image'

import { getProduct } from '@/lib/products'

type RingItem = { file: string; productId: string }

/**
 * Ten products, ordered so neighbouring shapes contrast.
 *
 * The count is load-bearing. The ring's perimeter is fixed, so item count and
 * item size trade directly against each other — at this radius the measured
 * ceiling is 8 items @ 22%, 10 @ 18.5%, 12 @ 14.75%. Adding an entry without
 * lowering ITEM_WIDTH will make products touch.
 */
const ITEMS: RingItem[] = [
  { file: 'copper-coil.webp', productId: 'copper-coil' },
  { file: 'brass-flare-nut.webp', productId: 'brass-flare-nut' },
  { file: 'insulated-flexible-duct.webp', productId: 'insulated-flexible-duct' },
  { file: 'gi-universal-clamp.webp', productId: 'gi-universal-clamp' },
  { file: 'duct-sealant.webp', productId: 'duct-sealant' },
  { file: 'brass-gate-valve.webp', productId: 'brass-gate-valve' },
  { file: 'slotted-channel.webp', productId: 'slotted-channel' },
  { file: 'copper-fitting.webp', productId: 'copper-fitting' },
  { file: 'industrial-socket.webp', productId: 'industrial-socket' },
  { file: 'cordless-drill.webp', productId: 'rotary-hammer-drill' },
]

const N = ITEMS.length
const STEP = (Math.PI * 2) / N
const AUTO_SPEED = 0.0026 // radians per frame
const DRAG_SENSITIVITY = 0.006
/** Past this many px of pointer travel a gesture counts as a drag, not a click */
const DRAG_THRESHOLD = 6

/**
 * Geometry, all as a share of the stage box so spacing holds at any width.
 * Ry < Rx reads as a turntable seen from slightly above.
 */
const RADIUS_X = 41
const RADIUS_Y = 39
const ITEM_WIDTH = 18.5

export function HeroProductRing() {
  const [rot, setRot] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [hovering, setHovering] = useState(false)

  const rotRef = useRef(0)
  const velRef = useRef(0)
  const lastXRef = useRef(0)
  const travelRef = useRef(0)
  const frameRef = useRef<number | null>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const on = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  // Animation loop: auto-spin, plus inertia after a drag
  useEffect(() => {
    const tick = () => {
      if (!dragging) {
        if (Math.abs(velRef.current) > 0.0002) {
          rotRef.current += velRef.current
          velRef.current *= 0.94
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
    travelRef.current = 0
    velRef.current = 0
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - lastXRef.current
      lastXRef.current = e.clientX
      travelRef.current += Math.abs(dx)
      const delta = dx * DRAG_SENSITIVITY
      rotRef.current += delta
      velRef.current = delta
      setRot(rotRef.current)
    },
    [dragging]
  )

  const endDrag = useCallback(() => setDragging(false), [])

  // Suppress the click that follows a drag, so spinning never opens a product
  const onItemClick = useCallback((e: React.MouseEvent) => {
    if (travelRef.current > DRAG_THRESHOLD) {
      e.preventDefault()
      e.stopPropagation()
    }
  }, [])

  const nudge = useCallback((dir: number) => {
    velRef.current = dir * 0.05
  }, [])

  return (
    <div
      className="relative w-full select-none"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Ring stage */}
      <div
        ref={stageRef}
        role="group"
        aria-label="Rotatable product showcase. Drag horizontally, or use arrow keys."
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') nudge(-1)
          if (e.key === 'ArrowRight') nudge(1)
        }}
        // Fills its column edge to edge — the column itself is sized wide in
        // hero.tsx. Staying inside the container avoids clipping at 1280px.
        className={`relative ml-auto aspect-square w-full max-w-[760px] touch-pan-y outline-none ${
          dragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* centre glow, echoing the reference lighting */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 size-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-[80px]"
          aria-hidden="true"
        />

        {ITEMS.map((item, i) => {
          const angle = i * STEP + rot
          const depth = Math.cos(angle) // 1 = nearest the viewer, -1 = furthest
          const t = (depth + 1) / 2 // 0…1

          // Elliptical orbit: y varies with depth too, so items spread around a
          // ring perimeter instead of collapsing onto a single horizontal axis.
          const x = Math.sin(angle) * RADIUS_X
          const y = depth * RADIUS_Y

          const scale = 0.58 + 0.42 * t
          const opacity = 0.62 + 0.38 * t
          const blur = (1 - t) * 1.2
          const name = getProduct(item.productId)?.name

          return (
            <Link
              key={item.file}
              href={`/products/${item.productId}`}
              onClick={onItemClick}
              aria-label={name ?? 'View product'}
              title={name}
              className="absolute transition-[filter] duration-200 hover:brightness-110"
              style={{
                // left/top percentages resolve against the stage. Percentages inside
                // transform: translate() would resolve against the item itself, which
                // collapses the ring — so the orbit must be expressed here.
                width: `${ITEM_WIDTH}%`,
                left: `${50 + x}%`,
                top: `${50 + y}%`,
                transform: `translate(-50%, -50%) scale(${scale})`,
                zIndex: Math.round(t * 100),
                opacity,
                filter: `blur(${blur}px) drop-shadow(0 18px 24px rgba(0,0,0,0.55)) drop-shadow(0 4px 7px rgba(0,0,0,0.42))`,
              }}
            >
              <Image
                src={`/images/ring/${item.file}`}
                alt=""
                width={480}
                height={480}
                sizes="180px"
                draggable={false}
                priority={i < 4}
                className="h-auto w-full object-contain"
              />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
