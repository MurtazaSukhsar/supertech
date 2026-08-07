'use client'

import { useEffect } from 'react'
import { Image } from '@/components/site-image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X, Trash2, Send } from 'lucide-react'
import { useQuote } from '@/context/quote-context'
import { useI18n } from '@/components/i18n-provider'
import { EASE_OUT, listItemVariants, panelVariants, springPop } from '@/lib/motion'

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
  const { t, href, isRtl } = useI18n()
  const shouldReduce = useReducedMotion()
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
    router.push(`${href('/contact')}?quote=basket`)
  }

  return (
    /* AnimatePresence lets the drawer animate *out* as well as in. Previously it
       returned null on close, so it vanished instantly. */
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
            onClick={closeDrawer}
            aria-hidden="true"
          />

      <div className="fixed inset-y-0 end-0 flex max-w-full ps-0 sm:ps-10">
        <motion.div
          variants={panelVariants(isRtl)}
          initial={shouldReduce ? 'visible' : 'hidden'}
          animate="visible"
          exit={shouldReduce ? 'visible' : 'exit'}
          className="w-screen sm:max-w-md bg-background shadow-2xl flex flex-col border-s border-border"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-5 bg-primary text-primary-foreground">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <ShoppingBagIcon className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-sans text-lg font-extrabold uppercase tracking-tight">
                  {t.quote.drawerTitle}
                </h2>
                <p className="text-xs text-primary-foreground/75">
                  {totalCount} {totalCount === 1 ? t.quote.itemCount : t.quote.itemCountPlural}{' '}
                  {t.quote.readyForQuote}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeDrawer}
              className="rounded-lg p-2 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              aria-label={t.quote.closeDrawer}
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
                <h3 className="text-base font-bold text-foreground">{t.quote.emptyTitle}</h3>
                <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                  {t.quote.emptyHelp}
                </p>
                <Link
                  href={href('/products')}
                  onClick={closeDrawer}
                  className="mt-6 inline-flex h-10 items-center rounded-lg btn-primary px-5 text-xs font-bold"
                >
                  {t.quote.browseProducts}
                </Link>
              </div>
            ) : (
              <AnimatePresence initial={false} mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={`${item.productId}-${item.selectedSize || 'default'}`}
                    layout={!shouldReduce}
                    variants={listItemVariants}
                    initial={shouldReduce ? 'visible' : 'hidden'}
                    animate="visible"
                    exit={shouldReduce ? 'visible' : 'exit'}
                    className="flex items-center justify-between gap-3.5 overflow-hidden rounded-xl border border-border bg-card p-3.5 shadow-sm transition-colors hover:border-accent/30"
                  >
                  {/* Image & Info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
                      <Image
                        src={item.image || '/placeholder.svg'}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-contain p-1"
                      />
                    </div>

                    <div className="min-w-0">
                      <h4 className="truncate font-sans text-xs font-bold text-foreground">
                        {item.productName}
                      </h4>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        {item.selectedSize && (
                          <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-bold text-secondary-foreground">
                            {t.quote.sizeLabel}: {item.selectedSize}
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
                  <motion.button
                    type="button"
                    whileTap={shouldReduce ? undefined : { scale: 0.85 }}
                    onClick={() => removeItem(item.productId, item.selectedSize)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1.5 shrink-0"
                    aria-label={`${t.quote.removeNamed} ${item.productName}`}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Footer Actions */}
          {items.length > 0 && (
            <div className="border-t border-border p-5 bg-surface-alt space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                <span>{t.quote.selectedItems}</span>
                <span className="font-bold text-foreground text-sm">
                  {totalCount} {totalCount === 1 ? t.quote.itemCount : t.quote.itemCountPlural}
                </span>
              </div>

              <button
                type="button"
                onClick={handleSendEmailForm}
                className="flex h-12 w-full items-center justify-center gap-2.5 rounded-lg btn-primary text-sm font-bold shadow-md"
              >
                <Send className="size-4" aria-hidden="true" />
                {t.quote.submitViaForm}
              </button>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={clearQuote}
                  className="text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors"
                >
                  {t.quote.clearAllItems}
                </button>
                <Link
                  href={href('/products')}
                  onClick={closeDrawer}
                  className="text-xs font-semibold text-accent hover:underline"
                >
                  {t.quote.continueBrowsing}
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
        </div>
      )}
    </AnimatePresence>
  )
}
