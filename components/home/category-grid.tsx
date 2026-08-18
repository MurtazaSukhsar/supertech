'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Image } from '@/components/site-image'
import { ArrowRight } from 'lucide-react'
import { getCategories } from '@/lib/catalog'
import { useI18n } from '@/components/i18n-provider'
import { CategoryIcon } from '@/components/category-icon'
import { ScrollReveal } from '@/components/scroll-reveal'
import { TiltCard } from '@/components/tilt-card'

export function CategoryGrid() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const { t, locale, href } = useI18n()
  const categories = getCategories(locale)

  return (
    <section className="section-pad mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12">
      <ScrollReveal variant="fade-up">
        <div className="mb-14 flex flex-col items-start gap-3">
          <p className="eyebrow">{t.home.categoriesEyebrow}</p>
          <h2 className="section-heading">{t.home.categoriesTitle}</h2>
          <p className="section-subheading">
            {t.home.categoriesSubtitle}
          </p>
        </div>
      </ScrollReveal>

      <div className="grid gap-5 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat, i) => {
          const isSiblingHovered = hoveredIdx !== null && hoveredIdx !== i

          return (
            <ScrollReveal
              key={cat.slug}
              delay={i * 60}
              variant="rotate-in-3d"
              className={`h-full transition-all duration-300 ${
                isSiblingHovered ? 'scale-[0.97] opacity-60 blur-[0.3px]' : ''
              }`}
            >
              <div
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="h-full"
              >
                <TiltCard className="group h-full overflow-hidden border border-border shadow-md transition-all duration-300 hover:shadow-2xl">
                  <Link
                    href={href(`/categories/${cat.slug}`)}
                    className="relative flex h-full flex-col overflow-hidden"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
                      {/* One fixed image per category, from the category record */}
                      <Image
                        src={cat.image || '/placeholder.svg'}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        cldWidth={800}
                        priority={i < 4}
                        className="object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/45 to-transparent transition-opacity duration-300 group-hover:opacity-95"
                        aria-hidden="true"
                      />
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-6 md:p-7">
                        <div>
                          <div className="mb-3.5 inline-flex size-11 items-center justify-center rounded-xl bg-accent shadow-md transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110">
                            <CategoryIcon icon={cat.icon} className="size-6 text-white" />
                          </div>
                          <h3 className="text-base font-black uppercase tracking-tight text-white leading-tight md:text-lg">
                            {cat.name}
                          </h3>
                          {cat.subcategories && cat.subcategories.length > 0 && (
                            <p className="mt-1.5 line-clamp-1 text-xs font-medium text-white/80">
                              {cat.subcategories.slice(0, 3).join(' • ')}
                            </p>
                          )}
                        </div>
                        <ArrowRight
                          className="rtl-flip mb-1 size-6 shrink-0 text-white transition-transform duration-300 group-hover:translate-x-1.5"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </Link>
                </TiltCard>
              </div>
            </ScrollReveal>
          )
        })}
      </div>
    </section>
  )
}
