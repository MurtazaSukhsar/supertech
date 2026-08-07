'use client'

import dynamic from 'next/dynamic'

// Rendered client-only: the scroll-driven card animation causes Next.js Image
// to compute different srcSet breakpoints on server vs. client, triggering
// hydration errors. Skipping SSR eliminates the mismatch entirely.
const FeaturedProducts = dynamic(
  () => import('@/components/home/featured-products').then((m) => m.FeaturedProducts),
  { ssr: false },
)

export function FeaturedProductsClient() {
  return <FeaturedProducts />
}
