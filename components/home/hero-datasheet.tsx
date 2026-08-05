'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

import { getFeaturedProducts, getCategory, getCategoryColor } from '@/lib/products'

const ITEMS = getFeaturedProducts().slice(0, 5)
const CYCLE_MS = 5000
const TICK_MS = 40

/** Short spec values read well in the floating callouts; long ones go in the table. */
function splitSpecs(specs: Record<string, string>) {
  const entries = Object.entries(specs).filter(([k]) => k.toLowerCase() !== 'brand')
  const short = entries.filter(([, v]) => v.length <= 22).slice(0, 2)
  const used = new Set(short.map(([k]) => k))
  const table = entries.filter(([k]) => !used.has(k)).slice(0, 3)
  return { callouts: short.length ? short : entries.slice(0, 2), table: table.length ? table : entries.slice(0, 3) }
}

export function HeroDatasheet() {
  const [index, setIndex] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const on = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  // Auto-advance with a visible progress bar
  useEffect(() => {
    if (paused || reduced) return
    const id = window.setInterval(() => {
      setElapsed((prev) => {
        if (prev + TICK_MS >= CYCLE_MS) {
          setIndex((i) => (i + 1) % ITEMS.length)
          return 0
        }
        return prev + TICK_MS
      })
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [paused, reduced])

  const select = useCallback((i: number) => {
    setIndex(i)
    setElapsed(0)
  }, [])

  // Cursor parallax on the card
  useEffect(() => {
    const el = wrapRef.current
    if (!el || reduced) return
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      el.style.setProperty('--rx', `${(-y * 5).toFixed(2)}deg`)
      el.style.setProperty('--ry', `${(x * 7).toFixed(2)}deg`)
    }
    const onLeave = () => {
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [reduced])

  const item = ITEMS[index]
  const category = getCategory(item.category)
  const color = getCategoryColor(item.category)
  const { callouts, table } = useMemo(() => splitSpecs(item.specs), [item])
  const progress = reduced ? 0 : (elapsed / CYCLE_MS) * 100

  return (
    <div
      ref={wrapRef}
      className="[--rx:0deg] [--ry:0deg] [perspective:1200px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative rounded-[22px] border border-white/16 bg-gradient-to-br from-white/10 to-white/[0.03] p-4 shadow-[0_30px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl transition-transform duration-300"
        style={{ transform: 'rotateX(var(--rx)) rotateY(var(--ry))' }}
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 px-1 pb-3">
          <span className="relative flex size-2 rounded-full bg-accent" aria-hidden="true">
            <span className="soft-pulse absolute inset-0 rounded-full bg-accent" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/75">Product Datasheet</span>
          <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
            REF {item.id.slice(0, 10).toUpperCase()}
          </span>
        </div>

        {/* Image stage with floating spec callouts */}
        <div className="relative overflow-hidden rounded-2xl bg-white">
          {/* technical grid over the photo */}
          <div
            className="pointer-events-none absolute inset-0 z-10 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(to right, #0A2472 1px, transparent 1px), linear-gradient(to bottom, #0A2472 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
            aria-hidden="true"
          />

          <div className="relative aspect-[4/3] w-full">
            {ITEMS.map((p, i) => (
              <Image
                key={p.id}
                src={p.images[0] || '/placeholder.svg'}
                alt={p.name}
                fill
                sizes="(max-width: 1024px) 90vw, 520px"
                priority={i === 0}
                className={`object-contain p-8 transition-opacity duration-500 ${
                  i === index ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>

          {/* Callout chips, pinned to the corners with a leader line */}
          {callouts.map(([key, value], i) => {
            const top = i === 0
            return (
              <div
                key={`${item.id}-${key}`}
                className={`absolute z-20 flex items-center gap-2 ${
                  top ? 'left-4 top-4 flex-row' : 'bottom-4 right-4 flex-row-reverse'
                }`}
              >
                <span
                  className="size-2.5 shrink-0 rounded-full ring-4"
                  style={{ backgroundColor: color.hex, boxShadow: `0 0 0 4px ${color.hex}22` }}
                  aria-hidden="true"
                />
                <span className="h-px w-5 shrink-0" style={{ backgroundColor: `${color.hex}66` }} aria-hidden="true" />
                <span className="max-w-[190px] rounded-lg border border-primary/10 bg-white/95 px-2.5 py-1.5 shadow-sm backdrop-blur-sm">
                  <span className="block text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    {key}
                  </span>
                  <span className="block truncate text-[11px] font-bold text-primary">{value}</span>
                </span>
              </div>
            )
          })}

          {/* Category tag */}
          <span
            className="absolute right-4 top-4 z-20 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: `${color.hex}1F`, color: color.hex }}
          >
            {category?.shortName ?? item.category}
          </span>
        </div>

        {/* Name + spec table */}
        <div className="mt-3.5 rounded-2xl border border-white/14 bg-white/[0.07] p-3.5">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-extrabold leading-snug text-white">{item.name}</p>
              <p className="mt-0.5 text-[11px] text-white/55">
                {item.brand ? `${item.brand} · ` : ''}
                {category?.name ?? item.category}
              </p>
            </div>
            <Link
              href={`/products/${item.id}`}
              className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/22 text-white transition-all hover:translate-x-0.5 hover:bg-accent hover:border-accent"
              aria-label={`View ${item.name}`}
            >
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <dl className="mt-3 space-y-1.5 border-t border-white/10 pt-2.5">
            {table.map(([key, value]) => (
              <div key={key} className="flex items-baseline justify-between gap-3">
                <dt className="shrink-0 text-[10px] font-bold uppercase tracking-[0.1em] text-white/45">{key}</dt>
                <dd className="truncate text-right font-mono text-[11px] text-white/85">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Progress + selector */}
        <div className="mt-2.5 flex items-center gap-2 px-1">
          {ITEMS.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => select(i)}
              aria-label={`Show ${p.name}`}
              aria-current={i === index}
              className="group relative h-1 flex-1 overflow-hidden rounded-full bg-white/15"
            >
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-accent transition-[width] duration-100 ease-linear"
                style={{ width: i < index ? '100%' : i === index ? `${progress}%` : '0%' }}
              />
              <span className="absolute -inset-y-2 inset-x-0" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
