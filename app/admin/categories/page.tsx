import { CategoriesManager } from '@/components/admin/categories-manager'
import { requireAdmin } from '@/lib/server/auth'
import { getCategories, getProducts, getTranslationsAr } from '@/lib/server/store'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  await requireAdmin()
  const [categories, products, translations] = await Promise.all([
    getCategories(),
    getProducts(),
    getTranslationsAr(),
  ])

  const counts = Object.fromEntries(
    categories.map((c) => [c.slug, products.filter((p) => p.category === c.slug).length]),
  )

  return (
    <CategoriesManager
      initialCategories={categories}
      counts={counts}
      arabic={translations.categories}
    />
  )
}
