import { notFound } from 'next/navigation'

import { ProductForm } from '@/components/admin/product-form'
import { requireAdmin } from '@/lib/server/auth'
import { getCategories, getProducts, getTranslationsAr } from '@/lib/server/store'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const productId = decodeURIComponent(id)

  const [products, categories, translations] = await Promise.all([
    getProducts(),
    getCategories(),
    getTranslationsAr(),
  ])

  const product = products.find((p) => p.id === productId)
  if (!product) notFound()

  return (
    <ProductForm
      product={product}
      arabic={translations.products[productId]}
      categories={categories}
    />
  )
}
