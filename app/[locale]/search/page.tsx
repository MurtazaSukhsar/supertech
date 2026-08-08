import type { Metadata } from 'next'
import { ProductCard } from '@/components/product-card'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { ScrollReveal } from '@/components/scroll-reveal'
import { searchProductsLocalized } from '@/lib/catalog'
import { getDictionary } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n/config'
import { primeSiteDataSafely } from '@/lib/server/site-data'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  await primeSiteDataSafely()
  const { locale } = await params
  const t = getDictionary(locale)

  return {
    title: t.search.metaTitle,
    // Search result pages carry no unique content worth indexing.
    robots: { index: false, follow: true },
  }
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}) {
  await primeSiteDataSafely()
  const { locale } = await params
  const { q = '' } = await searchParams
  const t = getDictionary(locale)
  const results = searchProductsLocalized(q, locale as Locale)

  return (
    <>
      <section className="bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:px-8 md:py-24 lg:px-12">
          <p className="eyebrow !text-accent">{t.search.eyebrow}</p>
          <h1 className="mt-4 text-balance text-3xl font-extrabold uppercase tracking-tight text-primary-foreground md:text-4xl lg:text-5xl">
            {t.search.title}
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10 md:px-8 md:py-16 lg:px-12">
        <Breadcrumbs crumbs={[{ label: t.search.breadcrumb }]} />
        <p className="mt-6 text-sm text-muted-foreground">
          {q
            ? `${results.length} ${results.length === 1 ? t.search.result : t.search.results} ${t.search.for} «${q}»`
            : t.search.prompt}
        </p>

        {results.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
            {results.map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 60}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          q && (
            <div className="mt-12 rounded-2xl border border-dashed border-border py-20 text-center">
              <p className="text-sm text-muted-foreground">{t.search.empty}</p>
            </div>
          )
        )}
      </div>
    </>
  )
}
