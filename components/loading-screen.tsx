'use client'

import { useEffect, useRef, useState } from 'react'

import { useI18n } from '@/components/i18n-provider'
import { siteImages } from '@/lib/products'
import { cldResize } from '@/lib/cloudinary-url'

/**
 * How long the brand mark stays up before it starts fading, and how long the
 * fade itself takes. Total time from hydration to the loader being gone is
 * HOLD + FADE.
 *
 * These used to be 300ms min / 2500ms max, with the max reachable whenever an
 * eagerly-loaded image hadn't decoded yet — the loader polled `document.images`
 * every 100ms and refused to leave until every non-lazy image was complete. On
 * a throttled mobile connection that reliably meant the full 2.5s of white
 * screen, which is measured directly by Speed Index (how quickly the viewport
 * reaches its final state) and is most of what a visitor experiences as "slow".
 *
 * Waiting on images was never necessary: the hero is server-rendered and the
 * images below it are lazy anyway, so there is nothing to protect the visitor
 * from seeing. The loader is now purely a timed brand moment, decoupled from
 * network conditions — it takes the same short time on a fast desktop and a
 * throttled phone.
 */
const HOLD_DURATION = 550
const FADE_DURATION = 400

// Sampled straight from /images/logo.webp — no other colours are used here.
const NAVY = '#00267C'
const RED = '#EE0009'

export function LoadingScreen() {
  const { t } = useI18n()
  const [done, setDone] = useState(false)
  const [hidden, setHidden] = useState(false)
  const barRef = useRef<HTMLSpanElement>(null)
  const pctRef = useRef<HTMLParagraphElement>(null)

  /* ---------- timed progress sweep ---------- */
  useEffect(() => {
    const start = performance.now()
    let raf = 0

    /**
     * The bar and the percentage are written straight to the DOM through refs
     * rather than through React state. Driving them with `setProgress` meant a
     * full React re-render on every animation frame for the whole life of the
     * loader — main-thread work landing in exactly the window Lighthouse
     * measures Total Blocking Time in, and competing with the app's own
     * hydration. Two refs and one rAF loop that stops on its own cost
     * essentially nothing.
     */
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / HOLD_DURATION)

      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`
      if (pctRef.current) pctRef.current.textContent = `${Math.round(p * 100)}%`

      if (p < 1) {
        raf = requestAnimationFrame(step)
      } else {
        setDone(true)
      }
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  /*
   * The pointer/touch/deviceorientation tilt effect that used to live here is
   * gone. It attached four global listeners (two of them firing on every
   * pointer and touch move) and ran an unbounded requestAnimationFrame loop
   * that never stopped until the loader unmounted, all to tilt a logo that is
   * on screen for well under a second. It was pure Total Blocking Time.
   *
   * The `--rx / --ry / --px / --py` custom properties it drove are still
   * declared in the CSS below with 0 defaults, so the layout and the "breathe"
   * animation are unchanged — the mark simply sits still now.
   *
   * The body scroll lock (`document.body.style.overflow = 'hidden'`) is gone
   * too: with a sub-second loader there is nothing to lock the page against,
   * and leaving `overflow` alone means no forced style recalculation on the
   * body at the busiest moment of the page's life.
   */

  useEffect(() => {
    if (!done) return
    const timer = window.setTimeout(() => setHidden(true), FADE_DURATION)
    return () => window.clearTimeout(timer)
  }, [done])

  if (hidden) return null

  return (
    <div
      className="st-loader"
      data-done={done ? 'true' : 'false'}
      role="status"
      aria-live="polite"
      aria-label={t.footer.loaderAria}
    >
      <div className="st-loader__stage">
        <div className="st-loader__tilt">
          {/* Plain <img> on purpose: skips the image optimizer hop so the mark paints instantly.
              multiply blending knocks out the JPEG's white box, so it reads as transparent. */}
          <img
            src={cldResize(siteImages.logo, 600)}
            alt={t.meta.siteName}
            className="st-loader__logo"
            decoding="async"
            fetchPriority="high"
          />
        </div>

        <p className="st-loader__name">
          SUPER <span>TECH</span>
        </p>
        <p className="st-loader__tag">{t.footer.loaderTag}</p>

        <div className="st-loader__bar" aria-hidden="true">
          <span ref={barRef} />
        </div>
        <p className="st-loader__pct" ref={pctRef}>0%</p>
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
          /* No CSS transition here on purpose: the rAF loop above now writes
             transform every frame, so a 260ms ease would be restarted on
             each write and the bar would visibly lag behind the percentage. */
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
          0%, 100% { transform: translate3d(var(--px), var(--py), 70px) scale(1.02); }
          50%      { transform: translate3d(var(--px), var(--py), 70px) scale(1.06); }
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
