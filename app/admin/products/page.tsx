import { ProductsManager } from '@/components/admin/products-manager'
import { requireAdmin } from '@/lib/server/auth'
import { getCategories, getProducts } from '@/lib/server/store'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  await requireAdmin()
  const [products, categories] = await Promise.all([getProducts(), getCategories()])

  return <ProductsManager initialProducts={products} categories={categories} />
}
