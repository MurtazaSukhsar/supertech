'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

const MIN_DURATION = 900 // keep the brand moment on screen at least this long
const MAX_DURATION = 7000 // hard fallback so a stuck asset never blocks the site
const FADE_DURATION = 600

// Sampled straight from /images/logo.webp — no other colours are used here.
const NAVY = '#00267C'
const RED = '#EE0009'

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const [hidden, setHidden] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)

  const finish = useCallback(() => setDone(true), [])

  /* ---------- asset tracking ---------- */
  useEffect(() => {
    const start = Date.now()
    let raf = 0
    let settled = false

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    /** Ratio of eagerly-loaded <img> elements that have finished decoding. */
    const imageProgress = () => {
      const imgs = Array.from(document.images).filter(
        (img) => img.loading !== 'lazy' && img.getAttribute('loading') !== 'lazy'
      )
      if (imgs.length === 0) return document.readyState === 'complete' ? 1 : 0.5
      return imgs.filter((img) => img.complete && img.naturalWidth > 0).length / imgs.length
    }

    const settle = () => {
      if (settled) return
      settled = true
      setProgress(1)
      window.setTimeout(finish, Math.max(0, MIN_DURATION - (Date.now() - start)))
    }

    const tick = () => {
      const elapsed = Date.now() - start
      const assets = imageProgress()
      const fontsReady = (document as Document & { fonts?: FontFaceSet }).fonts?.status === 'loaded'
      const pageReady = document.readyState === 'complete'

      const timeFloor = Math.min(0.9, elapsed / MAX_DURATION)
      const value = Math.max(timeFloor, assets * (pageReady ? 1 : 0.9))
      setProgress((p) => Math.max(p, Math.min(value, 0.99)))

      if ((pageReady && assets >= 1 && fontsReady !== false) || elapsed >= MAX_DURATION) {
        settle()
        return
      }
      raf = window.requestAnimationFrame(tick)
    }

    raf = window.requestAnimationFrame(tick)
    window.addEventListener('load', tick)

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('load', tick)
      document.body.style.overflow = prevOverflow
    }
  }, [finish])

  /* ---------- interactive 3D tilt (mouse / touch / device tilt) ---------- */
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0

    const apply = () => {
      cx += (tx - cx) * 0.09
      cy += (ty - cy) * 0.09
      el.style.setProperty('--rx', `${(-cy * 16).toFixed(2)}deg`)
      el.style.setProperty('--ry', `${(cx * 22).toFixed(2)}deg`)
      el.style.setProperty('--px', `${(cx * 18).toFixed(2)}px`)
      el.style.setProperty('--py', `${(cy * 18).toFixed(2)}px`)
      raf = window.requestAnimationFrame(apply)
    }
    raf = window.requestAnimationFrame(apply)

    const fromPoint = (x: number, y: number) => {
      tx = (x / window.innerWidth) * 2 - 1
      ty = (y / window.innerHeight) * 2 - 1
    }
    const onMove = (e: PointerEvent) => fromPoint(e.clientX, e.clientY)
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) fromPoint(t.clientX, t.clientY)
    }
    const onOrient = (e: DeviceOrientationEvent) => {
      tx = Math.max(-1, Math.min(1, (e.gamma ?? 0) / 35))
      ty = Math.max(-1, Math.min(1, ((e.beta ?? 0) - 40) / 35))
    }
    const onLeave = () => {
      tx = 0
      ty = 0
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })
    window.addEventListener('deviceorientation', onOrient)
    window.addEventListener('pointerleave', onLeave)

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('deviceorientation', onOrient)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  useEffect(() => {
    if (!done) return
    document.body.style.overflow = ''
    const t = window.setTimeout(() => setHidden(true), FADE_DURATION)
    return () => window.clearTimeout(t)
  }, [done])

  if (hidden) return null

  return (
    <div
      className="st-loader"
      data-done={done ? 'true' : 'false'}
      role="status"
      aria-live="polite"
      aria-label="Loading Super Tech International"
    >
      <div className="st-loader__stage" ref={stageRef}>
        <div className="st-loader__tilt">
          {/* Plain <img> on purpose: skips the image optimizer hop so the mark paints instantly.
              multiply blending knocks out the JPEG's white box, so it reads as transparent. */}
          <img
            src="/images/logo.webp"
            alt="Super Tech International Construction Materials Co."
            className="st-loader__logo"
            decoding="async"
          />
        </div>

        <p className="st-loader__name">
          SUPER <span>TECH</span>
        </p>
        <p className="st-loader__tag">Int&apos;l. Construction Materials Co.</p>

        <div className="st-loader__bar" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
        <p className="st-loader__pct">{Math.round(progress * 100)}%</p>
      </div>

      <style>{`
        .st-loader {
          --navy: ${NAVY};
          --red: ${RED};
          position: fixed;
          inset: 0;
          z-index: 200;
          display: grid;
          place-items: center;
          background: #fff;
          opacity: 1;
          transition: opacity ${FADE_DURATION}ms ease, visibility ${FADE_DURATION}ms ease;
          perspective: 1100px;
          overflow: hidden;
        }
        .st-loader::before {
          content: '';
          position: absolute;
          inset: -20%;
          background:
            radial-gradient(38% 38% at 30% 32%, rgba(0,38,124,0.10), transparent 70%),
            radial-gradient(34% 34% at 70% 66%, rgba(238,0,9,0.10), transparent 70%);
          animation: st-drift 12s ease-in-out infinite alternate;
          pointer-events: none;
        }
        .st-loader[data-done='true'] {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .st-loader__stage {
          --rx: 0deg; --ry: 0deg; --px: 0px; --py: 0px;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 24px;
          transform-style: preserve-3d;
        }
        .st-loader__tilt {
          position: relative;
          width: min(420px, 74vw);
          aspect-ratio: 3 / 2;
          display: grid;
          place-items: center;
          transform-style: preserve-3d;
          transform: rotateX(var(--rx)) rotateY(var(--ry));
          transition: transform 60ms linear;
        }

        /* Big, background-free logo */
        .st-loader__logo {
          position: relative;
          width: 100%;
          height: 100%;
          object-fit: contain;
          mix-blend-mode: multiply;
          transform: translate3d(var(--px), var(--py), 70px) scale(1.02);
          animation: st-breathe 3.4s ease-in-out infinite;
        }

        .st-loader__name {
          margin: 18px 0 0;
          font-size: clamp(20px, 4.4vw, 30px);
          font-weight: 900;
          letter-spacing: 0.3em;
          text-indent: 0.3em;
          color: var(--navy);
          transform: translateZ(40px);
        }
        .st-loader__name span { color: var(--red); }
        .st-loader__tag {
          margin: 10px 0 0;
          font-size: clamp(10px, 2.1vw, 12px);
          font-weight: 600;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--red);
          transform: translateZ(28px);
        }

        .st-loader__bar {
          margin-top: 28px;
          width: min(260px, 62vw);
          height: 3px;
          border-radius: 999px;
          background: rgba(0,38,124,0.14);
          overflow: hidden;
        }
        .st-loader__bar span {
          display: block;
          height: 100%;
          width: 100%;
          transform-origin: left center;
          transform: scaleX(0);
          border-radius: 999px;
          background: linear-gradient(90deg, var(--navy), var(--red));
          transition: transform 260ms ease-out;
        }
        .st-loader__pct {
          margin: 12px 0 0;
          font-size: 11px;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.16em;
          color: var(--navy);
        }

        @keyframes st-breathe {
          0%, 100% { filter: saturate(1); transform: translate3d(var(--px), var(--py), 70px) scale(1.02); }
          50%      { filter: saturate(1.12); transform: translate3d(var(--px), var(--py), 70px) scale(1.06); }
        }
        @keyframes st-drift {
          from { transform: translate3d(-3%, -2%, 0) scale(1); }
          to   { transform: translate3d(3%, 2%, 0) scale(1.08); }
        }

        @media (prefers-reduced-motion: reduce) {
          .st-loader::before,
          .st-loader__logo { animation: none; }
          .st-loader__tilt { transform: none; }
        }
      `}</style>
    </div>
  )
}
