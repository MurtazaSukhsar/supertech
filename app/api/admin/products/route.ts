import type { Product } from '@/lib/products'
import { jsonError, jsonOk, readBody, withAdmin } from '@/lib/server/api'
import {
  deleteProduct,
  getProducts,
  reorderProducts,
  saveProductTranslation,
  slugify,
  uniqueId,
  upsertProduct,
} from '@/lib/server/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type ProductPayload = Product & {
  originalId?: string
  arabic?: { name?: string; description?: string; specs?: Record<string, string> }
}

function validate(product: Partial<Product>): string | null {
  if (!product.name?.trim()) return 'Product name is required.'
  if (!product.category?.trim()) return 'Choose a category.'
  if (!product.description?.trim()) return 'Description is required.'
  if (!Array.isArray(product.images) || product.images.length === 0)
    return 'Add at least one image.'
  return null
}

export const GET = withAdmin(async () => jsonOk({ products: await getProducts() }))

export const POST = withAdmin(async (request) => {
  const body = await readBody<ProductPayload>(request)
  const problem = validate(body)
  if (problem) return jsonError(problem)

  const existing = await getProducts()
  const originalId = body.originalId
  const isEdit = Boolean(originalId && existing.some((p) => p.id === originalId))

  // A blank id means "derive one from the name"; on edit the id is kept so
  // existing links and Arabic copy keep pointing at the same product.
  let id = body.id?.trim() || slugify(body.name)
  if (!isEdit || id !== originalId) {
    id = uniqueId(
      slugify(id),
      existing.filter((p) => p.id !== originalId).map((p) => p.id),
    )
  }

  const product: Product = {
    id,
    name: body.name.trim(),
    category: body.category,
    subcategory: body.subcategory?.trim() || '',
    brand: body.brand?.trim() || undefined,
    images: body.images.filter(Boolean),
    description: body.description.trim(),
    specs: Object.fromEntries(
      Object.entries(body.specs ?? {}).filter(([k, v]) => k.trim() && String(v).trim()),
    ),
    featured: Boolean(body.featured),
  }

  const products = await upsertProduct(product, originalId)

  // Arabic copy is optional — an empty submission clears the override.
  if (body.arabic) {
    const hasText = Boolean(body.arabic.name?.trim() || body.arabic.description?.trim())
    await saveProductTranslation(id, hasText ? body.arabic : null)
  }

  return jsonOk({ product, products })
})

export const DELETE = withAdmin(async (request) => {
  const id = new URL(request.url).searchParams.get('id')
  if (!id) return jsonError('Missing product id.')
  return jsonOk({ products: await deleteProduct(id) })
})

/** Reorder the catalogue — the public grids render products in stored order. */
export const PATCH = withAdmin(async (request) => {
  const { order } = await readBody<{ order: string[] }>(request)
  if (!Array.isArray(order)) return jsonError('Expected an array of product ids.')

  await reorderProducts(order)
  return jsonOk({ products: await getProducts() })
})
