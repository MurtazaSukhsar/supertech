import { ProductForm } from '@/components/admin/product-form'
import { requireAdmin } from '@/lib/server/auth'
import { getCategories } from '@/lib/server/store'

export const dynamic = 'force-dynamic'

export default async function NewProductPage() {
  await requireAdmin()
  const categories = await getCategories()
  return <ProductForm categories={categories} />
}
