import type { Category, ContactInfo, Product, SiteImages } from '@/lib/products'
import type { BlogPost, Faq } from '@/lib/content'
import { adminClient } from '@/lib/supabase/clients'
import { bustCatalog } from './cache'

/**
 * Read/write access to the catalogue, backed by Supabase Postgres.
 *
 * Every exported name here matches what the previous JSON-file version
 * exported, so the admin API routes are unchanged. Writes go through the
 * service_role client, which is the only path RLS allows.
 *
 * Database columns are snake_case and nullable where the app type is optional;
 * `toProduct`/`toCategory` translate at the boundary so nothing above this file
 * has to know that.
 */

export type SiteData = {
  contact: ContactInfo
  images: SiteImages
}

export type ArabicTranslations = {
  categories: Record<string, { name: string; shortName: string; description: string }>
  subcategories: Record<string, string>
  specKeys: Record<string, string>
  products: Record<string, { name: string; description: string; specs?: Record<string, string> }>
}

type ProductRow = {
  id: string
  name: string
  category: string
  subcategory: string
  brand: string | null
  images: string[]
  description: string
  specs: Record<string, string>
  featured: boolean
  name_ar: string | null
  description_ar: string | null
  specs_ar: Record<string, string> | null
  sort_order: number
}

type CategoryRow = {
  slug: string
  name: string
  short_name: string
  description: string
  icon: string
  image: string
  subcategories: string[]
  name_ar: string | null
  short_name_ar: string | null
  description_ar: string | null
  sort_order: number
}

/** Throw with Supabase's message so the admin UI can show something useful. */
function unwrap<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message)
  return result.data as T
}

/** Drop every cached copy of the catalogue so the next render sees the write. */
const invalidate = bustCatalog

const toProduct = (row: ProductRow): Product => ({
  id: row.id,
  name: row.name,
  category: row.category,
  subcategory: row.subcategory,
  brand: row.brand ?? undefined,
  images: row.images ?? [],
  description: row.description,
  specs: row.specs ?? {},
  featured: row.featured,
})

const toCategory = (row: CategoryRow): Category => ({
  slug: row.slug,
  name: row.name,
  shortName: row.short_name,
  description: row.description,
  icon: row.icon,
  image: row.image,
  subcategories: row.subcategories ?? [],
})

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

export async function getProducts(): Promise<Product[]> {
  const rows = unwrap(
    await adminClient()
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false }),
  ) as ProductRow[]
  const products = rows.map(toProduct)
  // TEMP DIAGNOSTIC — remove once the two-domain sync issue is confirmed
  // fixed. Confirms the row actually reached Postgres (this always reads
  // live via adminClient(), it is never itself cached) and lets you see how
  // many rows each process sees.
  console.log(`[diag] getProducts() → ${products.length} rows — pid ${process.pid}`)
  return products
}

/** Persist display order. Position in the array becomes `sort_order`. */
export async function reorderProducts(ids: string[]): Promise<void> {
  const client = adminClient()
  await Promise.all(
    ids.map((id, index) => client.from('products').update({ sort_order: index }).eq('id', id)),
  )
  invalidate()
}

/**
 * Write one product's Arabic copy. Passing null clears it, so the Arabic site
 * falls back to English rather than showing stale translated text.
 */
export async function saveProductTranslation(
  id: string,
  arabic: { name?: string; description?: string; specs?: Record<string, string> } | null,
): Promise<void> {
  unwrap(
    await adminClient()
      .from('products')
      .update({
        name_ar: arabic?.name?.trim() || null,
        description_ar: arabic?.description?.trim() || null,
        specs_ar: arabic?.specs ?? null,
      })
      .eq('id', id)
      .select('id'),
  )
  invalidate()
}

export async function upsertProduct(product: Product, originalId?: string): Promise<Product[]> {
  const client = adminClient()

  // A renamed id needs a delete-then-insert; Postgres has no "rename primary
  // key" that also carries the row's other columns forward cleanly.
  if (originalId && originalId !== product.id) {
    await client.from('products').delete().eq('id', originalId)
  }

  unwrap(
    await client
      .from('products')
      .upsert(
        {
          id: product.id,
          name: product.name,
          category: product.category,
          subcategory: product.subcategory,
          brand: product.brand ?? null,
          images: product.images,
          description: product.description,
          specs: product.specs,
          featured: product.featured ?? false,
        },
        { onConflict: 'id' },
      )
      .select('id'),
  )

  invalidate()
  return getProducts()
}

export async function deleteProduct(id: string): Promise<Product[]> {
  unwrap(await adminClient().from('products').delete().eq('id', id).select('id'))
  invalidate()
  return getProducts()
}

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */

export async function getCategories(): Promise<Category[]> {
  const rows = unwrap(
    await adminClient().from('categories').select('*').order('sort_order', { ascending: true }),
  ) as CategoryRow[]
  return rows.map(toCategory)
}

export async function saveCategories(categories: Category[]): Promise<void> {
  const client = adminClient()

  // Anything no longer in the list was removed in the admin UI.
  const keep = categories.map((c) => c.slug)
  if (keep.length > 0) {
    await client.from('categories').delete().not('slug', 'in', `(${keep.join(',')})`)
  }

  unwrap(
    await client
      .from('categories')
      .upsert(
        categories.map((category, index) => ({
          slug: category.slug,
          name: category.name,
          short_name: category.shortName,
          description: category.description,
          icon: category.icon,
          image: category.image,
          subcategories: category.subcategories,
          sort_order: index,
        })),
        { onConflict: 'slug' },
      )
      .select('slug'),
  )
  invalidate()
}

export async function deleteCategory(slug: string): Promise<Category[]> {
  unwrap(await adminClient().from('categories').delete().eq('slug', slug).select('slug'))
  invalidate()
  return getCategories()
}

/**
 * Rename a category's slug, carrying its products with it.
 *
 * `products.category` is a foreign key with `on update cascade`, so a plain
 * UPDATE on the primary key moves every product automatically — no second
 * write, and no window where products point at a slug that no longer exists.
 */
export async function renameCategorySlug(from: string, to: string): Promise<void> {
  unwrap(await adminClient().from('categories').update({ slug: to }).eq('slug', from).select('slug'))
  invalidate()
}

export async function saveCategoryTranslation(
  slug: string,
  arabic: { name?: string; shortName?: string; description?: string } | null,
): Promise<void> {
  unwrap(
    await adminClient()
      .from('categories')
      .update({
        name_ar: arabic?.name?.trim() || null,
        short_name_ar: arabic?.shortName?.trim() || null,
        description_ar: arabic?.description?.trim() || null,
      })
      .eq('slug', slug)
      .select('slug'),
  )
  invalidate()
}

/* ------------------------------------------------------------------ */
/* Site settings                                                       */
/* ------------------------------------------------------------------ */

export async function getSite(): Promise<SiteData> {
  const row = unwrap(
    await adminClient().from('site_settings').select('contact, images').eq('id', true).maybeSingle(),
  ) as { contact: ContactInfo; images: SiteImages } | null

  return {
    contact: (row?.contact ?? {}) as ContactInfo,
    images: (row?.images ?? {}) as SiteImages,
  }
}

export async function saveSite(site: SiteData): Promise<void> {
  unwrap(
    await adminClient()
      .from('site_settings')
      .upsert({ id: true, contact: site.contact, images: site.images }, { onConflict: 'id' })
      .select('id'),
  )
  invalidate()
}

/* ------------------------------------------------------------------ */
/* Page-text overrides                                                 */
/* ------------------------------------------------------------------ */

export async function getContentOverrides(): Promise<Record<string, unknown>> {
  const rows = unwrap(await adminClient().from('content_overrides').select('locale, data')) as {
    locale: string
    data: unknown
  }[]
  return Object.fromEntries(rows.map((row) => [row.locale, row.data ?? {}]))
}

export async function saveContentOverrides(overrides: Record<string, unknown>): Promise<void> {
  const rows = Object.entries(overrides).map(([locale, data]) => ({ locale, data: data ?? {} }))
  if (rows.length === 0) return
  unwrap(
    await adminClient().from('content_overrides').upsert(rows, { onConflict: 'locale' }).select('locale'),
  )
  invalidate()
}

/* ------------------------------------------------------------------ */
/* FAQs                                                                */
/* ------------------------------------------------------------------ */

export async function getFaqs(locale = 'en'): Promise<Faq[]> {
  const rows = unwrap(
    await adminClient()
      .from('faqs')
      .select('question, answer')
      .eq('locale', locale)
      .order('sort_order', { ascending: true }),
  ) as Faq[]
  return rows
}

export async function saveFaqs(faqs: Faq[], locale = 'en'): Promise<void> {
  const client = adminClient()
  // The list is short and fully replaced on every save, so wiping the locale
  // and re-inserting keeps ordering trivially correct.
  unwrap(await client.from('faqs').delete().eq('locale', locale).select('id'))
  if (faqs.length > 0) {
    unwrap(
      await client
        .from('faqs')
        .insert(faqs.map((faq, index) => ({ ...faq, locale, sort_order: index })))
        .select('id'),
    )
  }
  invalidate()
}

/* ------------------------------------------------------------------ */
/* Blog                                                                */
/* ------------------------------------------------------------------ */

export type BlogPostArabic = {
  title?: string
  description?: string
  category?: string
  readTime?: string
  body?: string[]
}

type BlogPostRow = {
  slug: string
  title: string
  description: string
  category: string
  published_at: string
  read_time: string
  image: string
  body: string[]
  title_ar: string | null
  description_ar: string | null
  category_ar: string | null
  read_time_ar: string | null
  body_ar: string[] | null
  sort_order: number
}

const toBlogPost = (row: BlogPostRow): BlogPost => ({
  slug: row.slug,
  title: row.title,
  description: row.description,
  category: row.category,
  publishedAt: row.published_at,
  readTime: row.read_time,
  image: row.image,
  body: row.body ?? [],
})

const toBlogPostLocalized = (row: BlogPostRow, locale: string): BlogPost =>
  locale === 'ar'
    ? {
        slug: row.slug,
        title: row.title_ar || row.title,
        description: row.description_ar || row.description,
        category: row.category_ar || row.category,
        publishedAt: row.published_at,
        readTime: row.read_time_ar || row.read_time,
        image: row.image,
        body: row.body_ar?.length ? row.body_ar : (row.body ?? []),
      }
    : toBlogPost(row)

const toBlogPostArabic = (row: BlogPostRow): BlogPostArabic | undefined => {
  if (!row.title_ar && !row.description_ar && !row.category_ar && !row.read_time_ar && !row.body_ar) {
    return undefined
  }
  return {
    title: row.title_ar ?? undefined,
    description: row.description_ar ?? undefined,
    category: row.category_ar ?? undefined,
    readTime: row.read_time_ar ?? undefined,
    body: row.body_ar ?? undefined,
  }
}

async function fetchBlogRows(): Promise<BlogPostRow[]> {
  return unwrap(
    await adminClient()
      .from('blog_posts')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('published_at', { ascending: false }),
  ) as BlogPostRow[]
}

/** Public/localized read — what the site's rendering path sees (see lib/server/site-data.ts). */
export async function getBlog(locale = 'en'): Promise<BlogPost[]> {
  const rows = await fetchBlogRows()
  return rows.map((row) => toBlogPostLocalized(row, locale))
}

/** Admin read — English base copy, used by the blog manager list and edit form. */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const rows = await fetchBlogRows()
  return rows.map(toBlogPost)
}

/** One post's Arabic overrides, for the edit form's translation section. */
export async function getBlogPostTranslation(slug: string): Promise<BlogPostArabic | undefined> {
  const row = unwrap(
    await adminClient().from('blog_posts').select('*').eq('slug', slug).maybeSingle(),
  ) as BlogPostRow | null
  return row ? toBlogPostArabic(row) : undefined
}

export async function upsertBlogPost(
  post: BlogPost,
  originalSlug?: string,
  arabic?: BlogPostArabic | null,
): Promise<BlogPost[]> {
  const client = adminClient()

  // A renamed slug needs a delete-then-insert, same reasoning as products.
  if (originalSlug && originalSlug !== post.slug) {
    await client.from('blog_posts').delete().eq('slug', originalSlug)
  }

  unwrap(
    await client
      .from('blog_posts')
      .upsert(
        {
          slug: post.slug,
          title: post.title,
          description: post.description,
          category: post.category,
          published_at: post.publishedAt,
          read_time: post.readTime,
          image: post.image,
          body: post.body,
          title_ar: arabic?.title?.trim() || null,
          description_ar: arabic?.description?.trim() || null,
          category_ar: arabic?.category?.trim() || null,
          read_time_ar: arabic?.readTime?.trim() || null,
          body_ar: arabic?.body?.filter((p) => p.trim()).length ? arabic.body : null,
        },
        { onConflict: 'slug' },
      )
      .select('slug'),
  )

  invalidate()
  return getBlogPosts()
}

export async function deleteBlogPost(slug: string): Promise<BlogPost[]> {
  unwrap(await adminClient().from('blog_posts').delete().eq('slug', slug).select('slug'))
  invalidate()
  return getBlogPosts()
}

/* ------------------------------------------------------------------ */
/* Arabic translations                                                 */
/* ------------------------------------------------------------------ */

export async function getTranslationsAr(): Promise<ArabicTranslations> {
  const client = adminClient()

  const [products, categories, shared] = await Promise.all([
    client.from('products').select('id, name_ar, description_ar, specs_ar'),
    client.from('categories').select('slug, name_ar, short_name_ar, description_ar'),
    client.from('translations').select('scope, key, value_ar'),
  ])

  const result: ArabicTranslations = {
    categories: {},
    subcategories: {},
    specKeys: {},
    products: {},
  }

  for (const row of (products.data ?? []) as ProductRow[]) {
    if (!row.name_ar && !row.description_ar) continue
    result.products[row.id] = {
      name: row.name_ar ?? '',
      description: row.description_ar ?? '',
      specs: row.specs_ar ?? undefined,
    }
  }

  for (const row of (categories.data ?? []) as CategoryRow[]) {
    if (!row.name_ar) continue
    result.categories[row.slug] = {
      name: row.name_ar,
      shortName: row.short_name_ar ?? row.name_ar,
      description: row.description_ar ?? '',
    }
  }

  for (const row of (shared.data ?? []) as { scope: string; key: string; value_ar: string }[]) {
    if (row.scope === 'subcategory') result.subcategories[row.key] = row.value_ar
    else if (row.scope === 'spec_key') result.specKeys[row.key] = row.value_ar
  }

  return result
}

export async function saveTranslationsAr(translations: ArabicTranslations): Promise<void> {
  const client = adminClient()

  // Arabic product and category copy lives on the row it describes, so writing
  // it means updating those tables rather than a translations table.
  const productRows = Object.entries(translations.products).map(([id, tr]) => ({
    id,
    name_ar: tr.name || null,
    description_ar: tr.description || null,
    specs_ar: tr.specs ?? null,
  }))
  for (const row of productRows) {
    await client
      .from('products')
      .update({ name_ar: row.name_ar, description_ar: row.description_ar, specs_ar: row.specs_ar })
      .eq('id', row.id)
  }

  for (const [slug, tr] of Object.entries(translations.categories)) {
    await client
      .from('categories')
      .update({
        name_ar: tr.name || null,
        short_name_ar: tr.shortName || null,
        description_ar: tr.description || null,
      })
      .eq('slug', slug)
  }

  const shared = [
    ...Object.entries(translations.subcategories).map(([key, value_ar]) => ({
      scope: 'subcategory',
      key,
      value_ar,
    })),
    ...Object.entries(translations.specKeys).map(([key, value_ar]) => ({
      scope: 'spec_key',
      key,
      value_ar,
    })),
  ]
  if (shared.length > 0) {
    unwrap(await client.from('translations').upsert(shared, { onConflict: 'scope,key' }).select('key'))
  }

  invalidate()
}

/* ------------------------------------------------------------------ */
/* Helpers (unchanged)                                                 */
/* ------------------------------------------------------------------ */

/** Slugify a product name into a stable, URL-safe id. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/** Return `base`, or `base-2`, `base-3`… if the id is already taken. */
export function uniqueId(base: string, taken: Iterable<string>): string {
  const used = new Set(taken)
  if (!used.has(base)) return base
  let n = 2
  while (used.has(`${base}-${n}`)) n += 1
  return `${base}-${n}`
}
