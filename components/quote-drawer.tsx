'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { X, Trash2, Send } from 'lucide-react'
import { useQuote } from '@/context/quote-context'

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

export function QuoteDrawer() {
  const {
    items,
    removeItem,
    clearQuote,
    totalCount,
    isDrawerOpen,
    closeDrawer,
  } = useQuote()

  const router = useRouter()

  // Close drawer on Esc key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDrawerOpen, closeDrawer])

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isDrawerOpen])

  function handleSendEmailForm() {
    closeDrawer()
    router.push('/contact?quote=basket')
  }

  if (!isDrawerOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-primary/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-background shadow-2xl flex flex-col border-l border-border animate-slide-left">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-5 bg-primary text-primary-foreground">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <ShoppingBagIcon className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-sans text-lg font-extrabold uppercase tracking-tight">
                  Quote Basket
                </h2>
                <p className="text-xs text-primary-foreground/75">
                  {totalCount} {totalCount === 1 ? 'item' : 'items'} ready for quote request
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeDrawer}
              className="rounded-lg p-2 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              aria-label="Close quote drawer"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-secondary text-muted-foreground mb-4">
                  <ShoppingBagIcon className="size-8" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-foreground">Your quote basket is empty</h3>
                <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                  Browse products and click &ldquo;Add to Quote Basket&rdquo; to send a bulk material request.
                </p>
                <Link
                  href="/#categories"
                  onClick={closeDrawer}
                  className="mt-6 inline-flex h-10 items-center rounded-lg btn-primary px-5 text-xs font-bold"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedSize || 'default'}`}
                  className="flex items-center justify-between gap-3.5 rounded-xl border border-border bg-card p-3.5 shadow-sm transition-all hover:border-accent/30"
                >
                  {/* Image & Info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
                      <Image
                        src={item.image || '/placeholder.svg'}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <h4 className="truncate font-sans text-xs font-bold text-foreground">
                        {item.productName}
                      </h4>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        {item.selectedSize && (
                          <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-bold text-secondary-foreground">
                            Size: {item.selectedSize}
                          </span>
                        )}
                        {item.brand && (
                          <span className="text-[10px] font-semibold text-accent">
                            {item.brand}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId, item.selectedSize)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1.5 shrink-0"
                    aria-label={`Remove ${item.productName}`}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          {items.length > 0 && (
            <div className="border-t border-border p-5 bg-surface-alt space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                <span>Selected Items in Quote:</span>
                <span className="font-bold text-foreground text-sm">{totalCount} items</span>
              </div>

              <button
                type="button"
                onClick={handleSendEmailForm}
                className="flex h-12 w-full items-center justify-center gap-2.5 rounded-lg btn-primary text-sm font-bold shadow-md"
              >
                <Send className="size-4" aria-hidden="true" />
                Submit Quote via Inquiry Form
              </button>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={clearQuote}
                  className="text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors"
                >
                  Clear All Items
                </button>
                <Link
                  href="/#categories"
                  onClick={closeDrawer}
                  className="text-xs font-semibold text-accent hover:underline"
                >
                  Continue Browsing
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
