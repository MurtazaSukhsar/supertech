'use client'

import dynamic from 'next/dynamic'

/**
 * Lazy-loads the QuoteDrawer (9 KB) out of the initial bundle.
 * The drawer can only be opened by the user pressing a button, so loading
 * it on demand has no functional cost — the chunk arrives before the
 * drawer animation starts.
 */
const QuoteDrawerLazy = dynamic(
  () => import('@/components/quote-drawer').then((m) => m.QuoteDrawer),
  { ssr: false },
)

export function QuoteDrawerDeferred() {
  return <QuoteDrawerLazy />
}
