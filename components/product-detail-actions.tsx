'use client'

import { useState } from 'react'
import { MessageCircle, Check } from 'lucide-react'
import type { Product } from '@/lib/products'
import { useI18n } from '@/components/i18n-provider'
import { useQuote } from '@/context/quote-context'
import { contactInfo } from '@/lib/products'

function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

export function ProductDetailActions({ product }: { product: Product }) {
  const { t } = useI18n()
  const { addItem } = useQuote()

  // Extract size options from specs if available
  const sizeRaw =
    product.specs.Size ||
    product.specs['Available Size'] ||
    product.specs['Available Sizes'] ||
    product.specs['Inner Diameter'] ||
    ''

  // Parse size options
  const sizes = sizeRaw
    ? sizeRaw
        .split(/[,，]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : []

  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || '')
  const [addedAnimation, setAddedAnimation] = useState(false)

  function handleAddToCart() {
    addItem({
      productId: product.id,
      productName: product.name,
      category: product.category,
      subcategory: product.subcategory,
      brand: product.brand,
      image: product.images[0],
      selectedSize: selectedSize || undefined,
      quantity: 1,
    })

    setAddedAnimation(true)
    setTimeout(() => setAddedAnimation(false), 1200)
  }

  function handleDirectWhatsApp() {
    let msg = `Hello Super Tech Kuwait,\n\nI would like a quote for:\nProduct: ${product.name}\n`
    if (selectedSize) {
      msg += `Selected Size: ${selectedSize}\n`
    }
    if (product.brand) {
      msg += `Brand: ${product.brand}\n`
    }
    msg += `Please confirm stock availability and bulk pricing.`

    const url = `${contactInfo.whatsappHref}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
  }

  return (
    <div className="mt-8 flex flex-col gap-6 border-t border-b border-border py-6">
      {/* Size Selector (if sizes exist) */}
      {sizes.length > 0 && (
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-foreground block mb-3">
            Select Size / Specification Option:
          </label>
          <div className="flex flex-wrap gap-2.5">
            {sizes.map((size) => {
              const active = selectedSize === size
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`inline-flex items-center gap-1 sm:gap-1.5 rounded-lg border px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[11px] sm:text-xs font-bold transition-all duration-200 ${
                    active
                      ? 'border-accent bg-accent/10 text-accent shadow-sm scale-102'
                      : 'border-border bg-background text-foreground hover:bg-secondary'
                  }`}
                >
                  {active && <Check className="size-3 text-accent" aria-hidden="true" />}
                  {size}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Main Action Buttons */}
      <div className="flex gap-2 sm:gap-3.5">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`flex h-14 flex-1 items-center justify-center gap-1.5 sm:gap-2.5 rounded-lg btn-primary text-xs sm:text-base font-extrabold shadow-md transition-all ${
            addedAnimation ? 'scale-102 bg-green-600' : ''
          }`}
        >
          <ShoppingBagIcon className="size-4 sm:size-5" aria-hidden="true" />
          <span className="hidden sm:inline">{addedAnimation ? t.quote.addedToBasket : t.quote.addToBasket}</span>
          <span className="sm:hidden">{addedAnimation ? t.quote.addedShort : t.quote.addShort}</span>
        </button>

        <button
          type="button"
          onClick={handleDirectWhatsApp}
          className="flex h-14 flex-1 items-center justify-center gap-1.5 sm:gap-2.5 rounded-lg bg-[#25D366] text-xs sm:text-base font-extrabold text-white shadow-md shadow-[#25D366]/20 transition-all hover:opacity-95"
        >
          <MessageCircle className="size-4 sm:size-5" aria-hidden="true" />
          <span className="hidden sm:inline">{t.quote.requestViaWhatsApp}</span>
          <span className="sm:hidden">WhatsApp</span>
        </button>
      </div>
    </div>
  )
}
