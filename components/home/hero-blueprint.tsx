'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Wind, Waves, Droplets, Wrench, ArrowRight } from 'lucide-react'

type Node = {
  slug: string
  label: string
  blurb: string
  x: number
  y: number
  /** Pipe segments that light up when this node is active */
  segments: string[]
  Icon: typeof Wind
}

const NODES: Node[] = [
  {
    slug: 'air-conditioning',
    label: 'Air-Conditioning Materials',
    blurb: 'Copper tube, insulation rolls, filter driers, flare fittings.',
    x: 72,
    y: 116,
    segments: ['trunk'],
    Icon: Wind,
  },
  {
    slug: 'duct-accessories',
    label: 'Duct Accessories',
    blurb: 'Flexible duct connectors, canvas, grilles and dampers.',
    x: 372,
    y: 116,
    segments: ['trunk', 'riser'],
    Icon: Waves,
  },
  {
    slug: 'plumbing',
    label: 'Plumbing Supplies',
    blurb: 'Brass gate valves, UPVC cement, hemp, wrapping tape.',
    x: 264,
    y: 244,
    segments: ['trunk', 'riser', 'branch', 'stub'],
    Icon: Droplets,
  },
  {
    slug: 'tools',
    label: 'Hand & Power Tools',
    blurb: 'Socket sets, VDE screwdrivers, wrenches, site power tools.',
    x: 152,
    y: 392,
    segments: ['trunk', 'riser', 'riser2', 'floor'],
    Icon: Wrench,
  },
]

const SEGMENTS: Record<string, string> = {
  trunk: 'M108 116 H372',
  riser: 'M372 116 V244',
  branch: 'M372 244 H176',
  stub: 'M176 244 V308',
  riser2: 'M372 244 V392',
  floor: 'M372 392 H152',
}

export function HeroBlueprint() {
  const [active, setActive] = useState(0)
  const [locked, setLocked] = useState(false)
  const [drawn, setDrawn] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Self-draw once on mount
  useEffect(() => {
    const t = window.setTimeout(() => setDrawn(true), 120)
    return () => window.clearTimeout(t)
  }, [])

  // Auto-tour the system until the visitor takes over
  useEffect(() => {
    if (locked) return
    const id = window.setInterval(() => setActive((i) => (i + 1) % NODES.length), 2800)
    return () => window.clearInterval(id)
  }, [locked])

  // Cursor parallax
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      el.style.setProperty('--tilt-x', `${(-y * 7).toFixed(2)}deg`)
      el.style.setProperty('--tilt-y', `${(x * 9).toFixed(2)}deg`)
    }
    const onLeave = () => {
      el.style.setProperty('--tilt-x', '0deg')
      el.style.setProperty('--tilt-y', '0deg')
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  const node = NODES[active]
  const lit = new Set(node.segments)

  return (
    <div ref={wrapRef} className="stb" aria-label="Interactive supply system diagram">
      <div className="stb__card">
        <div className="stb__head">
          <span className="stb__dot" aria-hidden="true" />
          <span className="stb__headline">System Schematic</span>
          <span className="stb__meta">Live</span>
        </div>

        <svg viewBox="0 0 460 460" className="stb__svg" role="img" aria-hidden="true">
          <defs>
            <filter id="stb-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <pattern id="stb-grid" width="46" height="46" patternUnits="userSpaceOnUse">
              <path d="M46 0H0V46" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            </pattern>
          </defs>

          <rect width="460" height="460" fill="url(#stb-grid)" />

          {/* Air handling unit */}
          <g className={drawn ? 'stb__unit is-drawn' : 'stb__unit'}>
            <rect x="36" y="88" width="72" height="56" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
            <path d="M50 104h44M50 116h44M50 128h44" stroke="rgba(255,255,255,0.28)" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Terminal points */}
          <circle cx="176" cy="308" r="7" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
          <rect x="120" y="376" width="64" height="32" rx="6" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />

          {/* Base pipework */}
          {Object.entries(SEGMENTS).map(([key, d]) => (
            <path
              key={key}
              d={d}
              className={drawn ? 'stb__pipe is-drawn' : 'stb__pipe'}
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          ))}

          {/* Energised path for the active category */}
          {Object.entries(SEGMENTS).map(([key, d]) =>
            lit.has(key) ? (
              <path
                key={`lit-${key}`}
                d={d}
                className="stb__flow"
                fill="none"
                stroke="#FF4B54"
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#stb-glow)"
              />
            ) : null
          )}

          {/* Nodes */}
          {NODES.map((n, i) => (
            <g
              key={n.slug}
              className={`stb__node ${i === active ? 'is-active' : ''}`}
              transform={`translate(${n.x} ${n.y})`}
              onPointerEnter={() => {
                setLocked(true)
                setActive(i)
              }}
              onPointerLeave={() => setLocked(false)}
            >
              <circle r="20" className="stb__halo" />
              <circle r="9" className="stb__core" />
            </g>
          ))}
        </svg>

        {/* Caption */}
        <div className="stb__caption">
          <div className="stb__capicon" aria-hidden="true">
            <node.Icon className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="stb__caplabel">{node.label}</p>
            <p className="stb__capblurb">{node.blurb}</p>
          </div>
          <Link href={`/categories/${node.slug}`} className="stb__caplink" aria-label={`Browse ${node.label}`}>
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Tabs */}
        <div className="stb__tabs" role="tablist" aria-label="Product systems">
          {NODES.map((n, i) => (
            <button
              key={n.slug}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`stb__tab ${i === active ? 'is-active' : ''}`}
              onClick={() => {
                setLocked(true)
                setActive(i)
              }}
            >
              <n.Icon className="size-4 shrink-0" />
              <span className="truncate">{n.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .stb {
          --tilt-x: 0deg;
          --tilt-y: 0deg;
          perspective: 1200px;
          width: 100%;
        }
        .stb__card {
          position: relative;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.16);
          background: linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03));
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          padding: 16px;
          box-shadow: 0 30px 70px rgba(0,0,0,0.32);
          transform: rotateX(var(--tilt-x)) rotateY(var(--tilt-y));
          transition: transform 300ms ease;
          transform-style: preserve-3d;
        }
        .stb__head {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 2px 4px 12px;
        }
        .stb__dot {
          width: 8px; height: 8px; border-radius: 999px;
          background: #EE0009;
          box-shadow: 0 0 0 0 rgba(238,0,9,0.6);
          animation: stb-ping 2s ease-out infinite;
        }
        .stb__headline {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.75);
        }
        .stb__meta {
          margin-left: auto;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
        }
        .stb__svg { width: 100%; height: auto; display: block; overflow: visible; }

        .stb__pipe { stroke-dasharray: 420; stroke-dashoffset: 420; }
        .stb__pipe.is-drawn { animation: stb-draw 1.1s ease forwards; }
        .stb__unit { opacity: 0; }
        .stb__unit.is-drawn { animation: stb-fade 700ms ease 200ms forwards; }

        .stb__flow {
          stroke-dasharray: 14 12;
          animation: stb-march 900ms linear infinite;
          opacity: 0.95;
        }

        .stb__node { cursor: pointer; }
        .stb__halo {
          fill: rgba(255,255,255,0.10);
          stroke: rgba(255,255,255,0.25);
          stroke-width: 1;
          transition: all 300ms ease;
        }
        .stb__core {
          fill: #fff;
          transition: all 300ms ease;
        }
        .stb__node.is-active .stb__halo {
          fill: rgba(238,0,9,0.22);
          stroke: #FF4B54;
          animation: stb-pulse 1.8s ease-out infinite;
        }
        .stb__node.is-active .stb__core { fill: #FF4B54; }

        .stb__caption {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 14px;
          padding: 12px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.07);
        }
        .stb__capicon {
          display: grid; place-items: center;
          width: 38px; height: 38px; flex: none;
          border-radius: 11px;
          background: #EE0009;
          color: #fff;
        }
        .stb__caplabel {
          margin: 0;
          font-size: 13px;
          font-weight: 800;
          color: #fff;
          letter-spacing: 0.01em;
        }
        .stb__capblurb {
          margin: 3px 0 0;
          font-size: 11.5px;
          line-height: 1.45;
          color: rgba(255,255,255,0.65);
        }
        .stb__caplink {
          margin-left: auto;
          display: grid; place-items: center;
          width: 34px; height: 34px; flex: none;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.22);
          color: #fff;
          transition: background 200ms ease, transform 200ms ease;
        }
        .stb__caplink:hover { background: #EE0009; transform: translateX(2px); }

        .stb__tabs {
          display: grid;
          grid-template-columns: repeat(4, minmax(0,1fr));
          gap: 6px;
          margin-top: 10px;
        }
        .stb__tab {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 9px 6px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.7);
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: all 200ms ease;
        }
        .stb__tab:hover { background: rgba(255,255,255,0.12); color: #fff; }
        .stb__tab.is-active {
          background: #EE0009;
          border-color: #EE0009;
          color: #fff;
        }

        @keyframes stb-draw { to { stroke-dashoffset: 0; } }
        @keyframes stb-fade { to { opacity: 1; } }
        @keyframes stb-march { to { stroke-dashoffset: -26; } }
        @keyframes stb-ping {
          0% { box-shadow: 0 0 0 0 rgba(238,0,9,0.55); }
          70%, 100% { box-shadow: 0 0 0 9px rgba(238,0,9,0); }
        }
        @keyframes stb-pulse {
          0% { r: 20; opacity: 1; }
          70% { r: 30; opacity: 0.15; }
          100% { r: 20; opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .stb__pipe { stroke-dashoffset: 0; animation: none; }
          .stb__unit { opacity: 1; animation: none; }
          .stb__flow, .stb__dot, .stb__node.is-active .stb__halo { animation: none; }
          .stb__card { transform: none; }
        }
      `}</style>
    </div>
  )
}
