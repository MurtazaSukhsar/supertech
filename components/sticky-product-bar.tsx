'use client'

import { useEffect, useState } from 'react'
import { Image } from '@/components/site-image'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import type { Product } from '@/lib/products'
import { useI18n } from '@/components/i18n-provider'
import { InStockBadge } from '@/components/in-stock-badge'

export function StickyProductBar({ product }: { product: Product }) {
  const { t, href } = useI18n()
  const [show, setShow] = useState(false)

  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > 480)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`fixed top-0 inset-x-0 z-40 border-b border-border bg-background/98 shadow-md backdrop-blur-md transition-all duration-300 ${
        show
          ? 'translate-y-0 opacity-100'
          : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 py-2.5 sm:py-3 md:px-8 lg:px-12">
        {/* Left: Thumbnail & Title */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative size-11 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
            <Image
              src={product.images[0] || '/placeholder.svg'}
              alt=""
              fill
              sizes="44px"
              className="object-contain p-1"
            />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-sans text-sm font-bold text-foreground">
              {product.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase text-accent">
                {product.subcategory}
              </span>
              <span className="hidden sm:inline">
                <InStockBadge compact />
              </span>
            </div>
          </div>
        </div>

        {/* Right: Compact CTAs */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={`${href('/contact')}?product=${encodeURIComponent(product.name)}`}
            className="inline-flex h-9 items-center gap-2 rounded-lg btn-primary px-4 text-xs font-semibold"
          >
            <Mail className="size-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{t.common.requestQuote}</span>
            <span className="sm:hidden">{t.common.getQuote}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
