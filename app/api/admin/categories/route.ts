import type { Category } from '@/lib/products'
import { jsonError, jsonOk, readBody, withAdmin } from '@/lib/server/api'
import {
  deleteCategory,
  getCategories,
  getProducts,
  renameCategorySlug,
  saveCategories,
  saveCategoryTranslation,
  slugify,
} from '@/lib/server/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type CategoryPayload = Category & {
  originalSlug?: string
  arabic?: { name?: string; shortName?: string; description?: string }
}

export const GET = withAdmin(async () => jsonOk({ categories: await getCategories() }))

export const POST = withAdmin(async (request) => {
  const body = await readBody<CategoryPayload>(request)
  if (!body.name?.trim()) return jsonError('Category name is required.')

  const categories = await getCategories()
  const originalSlug = body.originalSlug
  const slug = slugify(body.slug?.trim() || body.name)

  if (categories.some((c) => c.slug === slug && c.slug !== originalSlug)) {
    return jsonError('Another category already uses that slug.')
  }

  // Rename first so the foreign key cascade carries the products across before
  // the rest of the fields are written.
  if (originalSlug && originalSlug !== slug) {
    await renameCategorySlug(originalSlug, slug)
  }

  const category: Category = {
    slug,
    name: body.name.trim(),
    shortName: body.shortName?.trim() || body.name.trim(),
    description: body.description?.trim() || '',
    icon: body.icon?.trim() || 'package',
    image: body.image?.trim() || '',
    subcategories: (body.subcategories ?? []).map((s) => s.trim()).filter(Boolean),
  }

  const next = await getCategories()
  const idx = next.findIndex((c) => c.slug === slug)
  if (idx >= 0) next[idx] = category
  else next.push(category)

  await saveCategories(next)

  if (body.arabic) {
    const hasText = Boolean(body.arabic.name?.trim())
    await saveCategoryTranslation(slug, hasText ? body.arabic : null)
  }

  return jsonOk({ categories: await getCategories() })
})

export const DELETE = withAdmin(async (request) => {
  const slug = new URL(request.url).searchParams.get('slug')
  if (!slug) return jsonError('Missing category slug.')

  const products = await getProducts()
  const inUse = products.filter((p) => p.category === slug).length
  if (inUse > 0) {
    return jsonError(
      `${inUse} product${inUse === 1 ? '' : 's'} still use this category. Move them first.`,
    )
  }

  return jsonOk({ categories: await deleteCategory(slug) })
})

/** Reorder categories — the homepage grid follows stored order. */
export const PATCH = withAdmin(async (request) => {
  const { order } = await readBody<{ order: string[] }>(request)
  if (!Array.isArray(order)) return jsonError('Expected an array of category slugs.')

  const categories = await getCategories()
  const bySlug = new Map(categories.map((c) => [c.slug, c]))
  const reordered = order.map((slug) => bySlug.get(slug)).filter(Boolean) as Category[]
  const missing = categories.filter((c) => !order.includes(c.slug))

  await saveCategories([...reordered, ...missing])
  return jsonOk({ categories: await getCategories() })
})
