'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { getProduct } from '@/lib/products'
import { useI18n } from '@/components/i18n-provider'

type Item = {
  file: string
  /** Most link to a product; the two catalogue shots link to their category */
  productId?: string
  categorySlug?: string
  label?: string
}

/**
 * Every extracted cutout. Only three are on screen at once, so unlike a ring
 * the item count has no effect on spacing — this list can grow freely.
 * Ordered so neighbouring products differ in material and silhouette.
 */
const ITEMS: Item[] = [
  { file: 'copper-coil.webp', productId: 'copper-coil' },
  { file: 'brass-gate-valve.webp', productId: 'brass-gate-valve' },
  { file: 'cordless-drill.webp', productId: 'rotary-hammer-drill' },
  { file: 'insulated-flexible-duct.webp', productId: 'insulated-flexible-duct' },
  { file: 'gi-universal-clamp.webp', productId: 'gi-universal-clamp' },
  { file: 'duct-sealant.webp', productId: 'duct-sealant' },
  { file: 'slotted-channel.webp', productId: 'slotted-channel' },
  { file: 'brass-flare-nut.webp', productId: 'brass-flare-nut' },
  { file: 'pvc-flexible-duct.webp', productId: 'pvc-flexible-duct' },
  { file: 'industrial-socket.webp', productId: 'industrial-socket' },
  { file: 'copper-fitting.webp', productId: 'copper-fitting' },
  { file: 'rubber-lined-clamp.webp', productId: 'rubber-lined-clamp' },
  { file: 'weldfix-upvc-cement.webp', productId: 'weldfix-upvc-cement' },
  { file: 'access-valves.webp', productId: 'access-valves' },
  { file: 'aluminium-rivet.webp', productId: 'aluminium-rivet' },
  { file: 'upvc-fitting.webp', categorySlug: 'plumbing', label: 'Plumbing Supplies' },
  { file: 'galvanized-fasteners.webp', categorySlug: 'hardware', label: 'Hardware Supplies' },
]

const N = ITEMS.length
const STEP = (Math.PI * 2) / N
/**
 * Front product width, as a share of the stage. With the neighbour scaled to
 * 0.45 and RADIUS_X at 50, this leaves the front product clear of its
 * neighbours rather than overlapping them.
 */
const ITEM_WIDTH = 55
/** How far the orbit swings sideways, as a share of the stage */
const RADIUS_X = 50
/** Items further round than this are fully hidden */
const VISIBLE_SPAN = 1.6
/**
 * Drag distance that advances one product, as a share of the stage width.
 * Relative rather than fixed px, so the gesture feels the same on a 360px
 * phone as on a 760px desktop stage.
 */
const DRAG_FRACTION = 0.34
const MIN_DRAG_PER_ITEM = 70
const AUTO_MS = 3600

/** Shortest signed distance from `i` to `pos` on a ring of N slots */
function wrapOffset(i: number, pos: number) {
  let d = i - pos
  while (d > N / 2) d -= N
  while (d < -N / 2) d += N
  return d
}

export function HeroProductCarousel() {
  const { t: dict, href } = useI18n()
  const [pos, setPos] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [touched, setTouched] = useState(false)

  const posRef = useRef(0)
  const targetRef = useRef(0)
  const dragStartRef = useRef(0)
  const dragPosRef = useRef(0)
  const travelRef = useRef(0)
  const hoverRef = useRef(false)
  const frameRef = useRef<number | null>(null)
  // A ref, not the state flag: pointermove can fire before React re-renders
  // after pointerdown, and reading stale state would drop the first move.
  const draggingRef = useRef(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const dragPerItemRef = useRef(190)

  // Keep the drag gesture proportional to however wide the stage actually is
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const measure = () => {
      dragPerItemRef.current = Math.max(MIN_DRAG_PER_ITEM, el.clientWidth * DRAG_FRACTION)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const on = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  // Ease toward the target slot every frame
  useEffect(() => {
    const tick = () => {
      const diff = targetRef.current - posRef.current
      if (Math.abs(diff) > 0.0005) {
        posRef.current += diff * 0.14
        setPos(posRef.current)
      }
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  // Advance on its own until the visitor interacts
  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      if (!hoverRef.current && !dragging) targetRef.current = Math.round(targetRef.current) + 1
    }, AUTO_MS)
    return () => window.clearInterval(id)
  }, [reduced, dragging])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    draggingRef.current = true
    setDragging(true)
    setTouched(true)
    dragStartRef.current = e.clientX
    dragPosRef.current = posRef.current
    travelRef.current = 0
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current) return
    const dx = e.clientX - dragStartRef.current
    travelRef.current = Math.abs(dx)
    targetRef.current = dragPosRef.current - dx / dragPerItemRef.current
  }, [])

  // Release snaps to the nearest product
  const endDrag = useCallback(() => {
    if (!draggingRef.current) return
    draggingRef.current = false
    setDragging(false)
    targetRef.current = Math.round(targetRef.current)
  }, [])

  const go = useCallback((dir: number) => {
    setTouched(true)
    targetRef.current = Math.round(targetRef.current) + dir
  }, [])

  const onItemClick = useCallback((e: React.MouseEvent, offset: number) => {
    // A drag shouldn't navigate; nor should clicking a product that isn't in front
    if (travelRef.current > 6 || Math.abs(offset) > 0.35) {
      e.preventDefault()
      if (Math.abs(offset) > 0.35) targetRef.current = Math.round(posRef.current + offset)
    }
  }, [])

  return (
    <div
      className="relative w-full select-none"
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
    >
      <div
        ref={stageRef}
        role="group"
        aria-label={dict.products.carouselLabel}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        // Links and images are natively draggable; that gesture hijacks the
        // pointer stream and stops pointermove firing, so block it here.
        onDragStart={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') go(-1)
          if (e.key === 'ArrowRight') go(1)
        }}
        className={`relative mx-auto aspect-[4/3] w-full max-w-[420px] touch-pan-y outline-none sm:aspect-square sm:max-w-[500px] lg:ms-auto lg:me-0 lg:max-w-[760px] ${
          dragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* glow behind the featured product */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 size-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-[90px]"
          aria-hidden="true"
        />

        {ITEMS.map((item, i) => {
          const offset = wrapOffset(i, pos)
          const away = Math.abs(offset)
          if (away > VISIBLE_SPAN) return null

          const angle = offset * STEP
          const x = Math.sin(angle) * RADIUS_X
          const depth = Math.cos(angle)
          const t = (depth + 1) / 2

          // Front product dominates; neighbours sit back and to the side
          const scale = Math.max(0.3, 1 - 0.55 * away)
          const fade = Math.max(0, 1 - away / VISIBLE_SPAN)
          const opacity = fade ** 1.3
          const blur = (1 - fade) * 3
          const name = item.productId ? getProduct(item.productId)?.name : item.label
          const itemHref = href(
            item.productId ? `/products/${item.productId}` : `/categories/${item.categorySlug}`,
          )

          return (
            <Link
              key={item.file}
              href={itemHref}
              onClick={(e) => onItemClick(e, offset)}
              aria-label={name ?? dict.products.viewProduct}
              title={name}
              aria-hidden={away > 0.35}
              tabIndex={away > 0.35 ? -1 : 0}
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              className="absolute"
              style={{
                width: `${ITEM_WIDTH}%`,
                left: `${50 + x}%`,
                top: '50%',
                transform: `translate(-50%, -50%) scale(${scale})`,
                zIndex: Math.round(t * 100),
                opacity,
                filter: `blur(${blur}px) drop-shadow(0 24px 34px rgba(0,0,0,0.55)) drop-shadow(0 5px 9px rgba(0,0,0,0.4))`,
                WebkitUserDrag: 'none',
              } as React.CSSProperties}
            >
              <Image
                src={`/images/ring/${item.file}`}
                alt=""
                width={480}
                height={480}
                sizes="(max-width: 640px) 60vw, (max-width: 1024px) 280px, 420px"
                draggable={false}
                priority={i < 3}
                className="pointer-events-none h-auto w-full object-contain"
              />
            </Link>
          )
        })}
      </div>

      {/* Position line — the marker slides left/right as products come round */}
      <div
        className="mx-auto mt-1 h-[3px] w-36 overflow-hidden rounded-full bg-white/15 sm:-mt-2 sm:w-48"
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full bg-accent"
          style={{
            width: `${100 / N}%`,
            transform: `translateX(${(((pos % N) + N) % N) * 100}%)`,
          }}
        />
      </div>

      {/* Hint — fades back once the visitor has worked out they can drag */}
      <div
        className="mt-2.5 flex items-center justify-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-primary-foreground/50 transition-opacity duration-500 sm:mt-3 sm:gap-2 sm:text-[10px] sm:tracking-[0.18em]"
        style={{ opacity: touched ? 0.35 : 1 }}
      >
        <ChevronLeft className="size-3 shrink-0 animate-pulse sm:size-3.5" aria-hidden="true" />
        <span>
          <span className="sm:hidden">{dict.products.swipeMore}</span>
          <span className="hidden sm:inline">{dict.products.dragMore}</span>
        </span>
        <ChevronRight className="size-3 shrink-0 animate-pulse sm:size-3.5" aria-hidden="true" />
      </div>
    </div>
  )
}
