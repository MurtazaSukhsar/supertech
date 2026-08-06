/**
 * Brand Icons — premium SVG icon set for Super Tech website.
 * Stroke-based, scales perfectly, uses currentColor for tint + brand accent fills.
 */

type IconProps = { className?: string }

/* ── Stats Counter Icons ─────────────────────────────────── */

export function IconProjectsDelivered({ className = 'size-8' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="26" height="28" rx="3" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M11 4h18a3 3 0 0 1 3 3v28a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M13 18l4 4 8-8" stroke="#D91E2A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="28" cy="28" r="7" fill="#D91E2A"/>
      <path d="M25 28l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconYearsInKuwait({ className = 'size-8' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="9" width="32" height="27" rx="3" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M4 16h32" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M13 4v10M27 4v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <rect x="10" y="21" width="6" height="5" rx="1" fill="#D91E2A"/>
      <rect x="17" y="21" width="6" height="5" rx="1" fill="currentColor" fillOpacity="0.3"/>
      <rect x="24" y="21" width="6" height="5" rx="1" fill="currentColor" fillOpacity="0.3"/>
    </svg>
  )
}

export function IconProductsInStock({ className = 'size-8' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 16l14-10 14 10v18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V16z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M14 36V24h12v12" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <rect x="22" y="10" width="14" height="14" rx="2" fill="#D91E2A"/>
      <path d="M26 17h6M29 14v6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

export function IconGlobalBrands({ className = 'size-8' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="15" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M20 5c-4 4-6 9-6 15s2 11 6 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M20 5c4 4 6 9 6 15s-2 11-6 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M5 20h30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 13h26M7 27h26" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="20" cy="20" r="4" fill="#D91E2A"/>
    </svg>
  )
}

/* ── Why Choose Us / Trust Badge Icons ───────────────────── */

export function IconPremiumQuality({ className = 'size-8' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4l3.8 7.7L32 13l-5.8 5.7 1.4 8.2L20 23l-7.6 3.9 1.4-8.2L8 13l8.2-1.3L20 4z" fill="#D91E2A" fillOpacity="0.15" stroke="#D91E2A" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M15 20l3.5 3.5 6.5-7" stroke="#D91E2A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconReliableService({ className = 'size-8' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="18" r="8" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M14 18a6 6 0 0 1 12 0" stroke="currentColor" strokeWidth="0"/>
      <circle cx="20" cy="15" r="3" fill="currentColor" fillOpacity="0.4"/>
      <path d="M8 36c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="30" cy="30" r="7" fill="#D91E2A"/>
      <path d="M27.5 30l1.5 1.5 3-3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconFastDelivery({ className = 'size-8' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="16" width="22" height="14" rx="2" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M26 20h6l4 7v3h-10V20z" fill="#D91E2A" fillOpacity="0.15" stroke="#D91E2A" strokeWidth="1.8" strokeLinejoin="round"/>
      <circle cx="11" cy="32" r="3.5" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="11" cy="32" r="1.5" fill="white"/>
      <circle cx="30" cy="32" r="3.5" fill="#D91E2A" stroke="#D91E2A" strokeWidth="1.5"/>
      <circle cx="30" cy="32" r="1.5" fill="white"/>
      <path d="M4 22h-4M4 26h-6" stroke="#D91E2A" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

export function IconTrustedProfessionals({ className = 'size-8' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="26" cy="14" r="5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M4 34c0-5.5 4.5-10 10-10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M16 34c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="26" cy="30" r="6" fill="#D91E2A"/>
      <path d="M23.5 30l1.5 1.5 3.5-3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

/* ── Category Icons ──────────────────────────────────────── */

export function IconAirConditioning({ className = 'size-8' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="10" width="32" height="14" rx="3" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="10" cy="17" r="2.5" fill="#D91E2A"/>
      <path d="M17 17h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M14 28c0 3 3 6 6 6M20 28c0 3 3 6 6 6M26 28c0 3 3 6 6 6" stroke="#D91E2A" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

export function IconHardware({ className = 'size-8' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 10a6 6 0 0 1 12 0v4l8 20H6L14 14V10z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M8 28h24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="20" cy="12" r="3" fill="#D91E2A"/>
    </svg>
  )
}

export function IconTools({ className = 'size-8' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 8a6 6 0 0 1 6 6c0 1-.2 2-.6 2.8L30 32a3 3 0 1 1-4.2 4.2L10.8 21.4A6 6 0 1 1 10 8z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M30 8l-5 5 2 2 5-5-2-2z" fill="#D91E2A" stroke="#D91E2A" strokeWidth="1" strokeLinejoin="round"/>
      <path d="M31 10c0 0 3 2 3 5" stroke="#D91E2A" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="31" r="2" fill="#D91E2A"/>
    </svg>
  )
}

export function IconConstruction({ className = 'size-8' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="28" width="28" height="6" rx="2" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="12" y="20" width="16" height="8" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="16" y="14" width="8" height="6" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M20 6v8" stroke="#D91E2A" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M14 10l6-4 6 4" stroke="#D91E2A" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconIndustrial({ className = 'size-8' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="8" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="20" cy="20" r="3" fill="#D91E2A"/>
      <path d="M20 4v6M20 30v6M4 20h6M30 20h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8.1 8.1l4.2 4.2M27.7 27.7l4.2 4.2M8.1 31.9l4.2-4.2M27.7 12.3l4.2-4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}
