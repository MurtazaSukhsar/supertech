import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { categories, getCategory, getProductsByCategory } from '@/lib/products'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { CategoryIcon } from '@/components/category-icon'
import { CategoryProductGrid } from '@/components/category-product-grid'

export function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = getCategory(slug)
  if (!category) return {}
  return {
    title: `${category.name} Supplier in Kuwait`,
    description: `${category.description} Request bulk pricing and delivery from Super Tech Kuwait.`,
    alternates: {
      canonical: `/categories/${category.slug}`,
    },
    openGraph: {
      title: `${category.name} Supplier in Kuwait`,
      description: category.description,
      images: [category.image],
    },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = getCategory(slug)
  if (!category) notFound()

  const products = getProductsByCategory(slug)

  return (
    <>
      {/* Category hero band */}
      <section className="bg-primary">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24 lg:px-12">
          <div className="flex items-start gap-6">
            <div className="hidden size-16 shrink-0 items-center justify-center rounded-xl bg-accent shadow-lg shadow-accent/20 sm:flex">
              <CategoryIcon icon={category.icon} className="size-8 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-balance text-3xl font-extrabold uppercase tracking-tight text-primary-foreground md:text-4xl lg:text-5xl">
                {category.name}
              </h1>
              <p className="mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-primary-foreground/70 md:text-base">
                {category.description}
              </p>
              {category.subcategories && category.subcategories.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {category.subcategories.map((sub) => (
                    <span
                      key={sub}
                      className="inline-flex items-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-sm"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10 md:px-8 md:py-16 lg:px-12">
        <div className="mb-10">
          <Breadcrumbs crumbs={[{ label: 'Products', href: '/products' }, { label: category.name }]} />
        </div>
        <CategoryProductGrid products={products} />
      </div>
    </>
  )
}
