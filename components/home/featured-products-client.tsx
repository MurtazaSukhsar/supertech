'use client'

import dynamic from 'next/dynamic'

// Rendered client-only: the scroll-driven card animation causes Next.js Image
// to compute different srcSet breakpoints on server vs. client, triggering
// hydration errors. Skipping SSR eliminates the mismatch entirely.
//
// `loading` reserves the section's full 500vh scroll track up front, matching
// the real section's outer element exactly. Without it, the page renders at
// its normal height until this chunk hydrates, then suddenly grows by five
// viewport-heights — shoving everything below (stats, testimonials, footer)
// down right as someone starts scrolling. Reserving the space up front turns
// that layout jump into nothing.
const FeaturedProducts = dynamic(
  () => import('@/components/home/featured-products').then((m) => m.FeaturedProducts),
  {
    ssr: false,
    loading: () => <section className="relative h-[500vh] bg-surface-alt" aria-hidden="true" />,
  },
)

export function FeaturedProductsClient() {
  return <FeaturedProducts />
}
