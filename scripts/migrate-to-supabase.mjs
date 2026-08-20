/**
 * One-time migration: data/*.json  ->  Supabase (+ optional Cloudinary upload).
 *
 *   node scripts/migrate-to-supabase.mjs            # data only
 *   node scripts/migrate-to-supabase.mjs --images   # also upload local images
 *
 * Safe to re-run: every write is an upsert keyed on the slug or id, so a second
 * run updates rows rather than duplicating them.
 *
 * Order matters — categories go first because products reference them by
 * foreign key.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { createClient } from '@supabase/supabase-js'
import { v2 as cloudinary } from 'cloudinary'

// Node < 22 doesn't have native WebSockets. Polyfill a dummy class so the Supabase client
// constructor doesn't crash, since this migration script only uses REST and never connects
// to realtime WebSockets.
if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = class {}
}

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

/* ------------------------------------------------------------------ */
/* Env                                                                 */
/* ------------------------------------------------------------------ */

function loadEnv() {
  const files = ['.env', '.env.local']
  for (const name of files) {
    const file = path.join(root, name)
    if (!fs.existsSync(file)) continue
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (match) {
        const val = match[2].replace(/^["']|["']$/g, '').trim()
        if (val && !process.env[match[1]]) {
          process.env[match[1]] = val
        }
      }
    }
  }
}
loadEnv()

function need(name) {
  const value = process.env[name]
  if (!value) {
    console.error(`\nMissing ${name} in .env or .env.local — see docs/SUPABASE-SETUP.md\n`)
    process.exit(1)
  }
  return value
}

const supabase = createClient(
  need('NEXT_PUBLIC_SUPABASE_URL'),
  need('SUPABASE_SERVICE_ROLE_KEY'),
  { auth: { persistSession: false } },
)

const withImages = process.argv.includes('--images')

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const read = (name) => JSON.parse(fs.readFileSync(path.join(root, 'data', name), 'utf8'))

function check(label, { error }) {
  if (error) {
    console.error(`\n${label} failed: ${error.message}\n`)
    process.exit(1)
  }
  console.log(`  ${label}`)
}

/**
 * Upload one local image to Cloudinary and return its delivery URL.
 * Results are memoised so an image shared by several products uploads once.
 */
const uploaded = new Map()

async function uploadLocal(imagePath) {
  if (!imagePath?.startsWith('/images/')) return imagePath
  if (uploaded.has(imagePath)) return uploaded.get(imagePath)

  const absolute = path.join(root, 'public', imagePath)
  if (!fs.existsSync(absolute)) {
    console.warn(`    missing file, keeping path as-is: ${imagePath}`)
    uploaded.set(imagePath, imagePath)
    return imagePath
  }

  const publicId = path.parse(imagePath).name
  const result = await cloudinary.uploader.upload(absolute, {
    folder: process.env.CLOUDINARY_FOLDER ?? 'super-tech/products',
    public_id: publicId,
    overwrite: true,
    resource_type: 'image',
  })

  const url = cloudinary.url(result.public_id, {
    transformation: [{ raw_transformation: 'f_auto,q_auto' }],
  })
  uploaded.set(imagePath, url)
  return url
}

async function mapImages(list) {
  if (!withImages) return list
  const out = []
  for (const image of list) out.push(await uploadLocal(image))
  return out
}

/* ------------------------------------------------------------------ */
/* Run                                                                 */
/* ------------------------------------------------------------------ */

async function main() {
  console.log('\nMigrating to Supabase…\n')

  if (withImages) {
    cloudinary.config({
      cloud_name: need('CLOUDINARY_CLOUD_NAME'),
      api_key: need('CLOUDINARY_API_KEY'),
      api_secret: need('CLOUDINARY_API_SECRET'),
      secure: true,
    })
    console.log('Cloudinary upload enabled — this takes a few minutes.\n')
  }

  const categories = read('categories.json')
  const products = read('products.json')
  const site = read('site.json')
  const faqsEn = read('faqs.json')
  const faqsAr = read('faqs-ar.json')
  const ar = read('translations-ar.json')
  const blogEn = read('blog.json')
  const blogAr = fs.existsSync(path.join(root, 'data', 'blog-ar.json')) ? read('blog-ar.json') : []

  // --- Categories (first: products reference them) -------------------
  const categoryRows = []
  for (const [index, category] of categories.entries()) {
    const tr = ar.categories?.[category.slug]
    categoryRows.push({
      slug: category.slug,
      name: category.name,
      short_name: category.shortName ?? '',
      description: category.description ?? '',
      icon: category.icon ?? 'package',
      image: withImages ? await uploadLocal(category.image) : (category.image ?? ''),
      subcategories: category.subcategories ?? [],
      name_ar: tr?.name ?? null,
      short_name_ar: tr?.shortName ?? null,
      description_ar: tr?.description ?? null,
      sort_order: index,
    })
  }
  check(
    `categories (${categoryRows.length})`,
    await supabase.from('categories').upsert(categoryRows, { onConflict: 'slug' }),
  )

  // --- Products ------------------------------------------------------
  const productRows = []
  for (const [index, product] of products.entries()) {
    const tr = ar.products?.[product.id]
    productRows.push({
      id: product.id,
      name: product.name,
      category: product.category,
      subcategory: product.subcategory ?? '',
      brand: product.brand ?? null,
      images: await mapImages(product.images ?? []),
      description: product.description ?? '',
      specs: product.specs ?? {},
      featured: Boolean(product.featured),
      name_ar: tr?.name ?? null,
      description_ar: tr?.description ?? null,
      specs_ar: tr?.specs ?? null,
      sort_order: index,
    })
  }
  // Chunked so one oversized request can't blow the payload limit.
  for (let i = 0; i < productRows.length; i += 50) {
    const chunk = productRows.slice(i, i + 50)
    check(
      `products ${i + 1}–${i + chunk.length}`,
      await supabase.from('products').upsert(chunk, { onConflict: 'id' }),
    )
  }

  // --- Site settings -------------------------------------------------
  const images = { ...site.images }
  if (withImages) {
    for (const [key, value] of Object.entries(images)) {
      images[key] = await uploadLocal(value)
    }
  }
  check(
    'site settings',
    await supabase
      .from('site_settings')
      .upsert({ id: true, contact: site.contact, images }, { onConflict: 'id' }),
  )

  // --- Page-text overrides ------------------------------------------
  const content = fs.existsSync(path.join(root, 'data', 'content.json'))
    ? read('content.json')
    : { en: {}, ar: {} }
  check(
    'page-text overrides',
    await supabase
      .from('content_overrides')
      .upsert(
        Object.entries(content).map(([locale, data]) => ({ locale, data: data ?? {} })),
        { onConflict: 'locale' },
      ),
  )

  // --- FAQs ----------------------------------------------------------
  await supabase.from('faqs').delete().neq('locale', '__none__')
  check(
    `FAQs (${faqsEn.length} en, ${faqsAr.length} ar)`,
    await supabase.from('faqs').insert([
      ...faqsEn.map((faq, i) => ({ ...faq, locale: 'en', sort_order: i })),
      ...faqsAr.map((faq, i) => ({ ...faq, locale: 'ar', sort_order: i })),
    ]),
  )

  // --- Blog posts ------------------------------------------------------
  const blogArBySlug = new Map(blogAr.map((post) => [post.slug, post]))
  const blogRows = []
  for (const [index, post] of blogEn.entries()) {
    const tr = blogArBySlug.get(post.slug)
    blogRows.push({
      slug: post.slug,
      title: post.title,
      description: post.description ?? '',
      category: post.category ?? '',
      published_at: post.publishedAt,
      read_time: post.readTime ?? '',
      image: withImages ? await uploadLocal(post.image) : (post.image ?? ''),
      body: post.body ?? [],
      title_ar: tr?.title ?? null,
      description_ar: tr?.description ?? null,
      category_ar: tr?.category ?? null,
      read_time_ar: tr?.readTime ?? null,
      body_ar: tr?.body ?? null,
      sort_order: index,
    })
  }
  check(
    `blog posts (${blogRows.length})`,
    await supabase.from('blog_posts').upsert(blogRows, { onConflict: 'slug' }),
  )

  // --- Shared Arabic labels -----------------------------------------
  const shared = [
    ...Object.entries(ar.subcategories ?? {}).map(([key, value_ar]) => ({
      scope: 'subcategory',
      key,
      value_ar,
    })),
    ...Object.entries(ar.specKeys ?? {}).map(([key, value_ar]) => ({
      scope: 'spec_key',
      key,
      value_ar,
    })),
  ]
  check(
    `Arabic labels (${shared.length})`,
    await supabase.from('translations').upsert(shared, { onConflict: 'scope,key' }),
  )

  console.log('\nDone.')
  if (withImages) {
    console.log(`Uploaded ${uploaded.size} images to Cloudinary.`)
    console.log('Product image URLs in Supabase now point at Cloudinary.')
  } else {
    console.log('Images were left as /images/... paths. Re-run with --images to upload them.')
  }
  console.log('')
}

main().catch((error) => {
  console.error('\nMigration failed:', error.message, '\n')
  process.exit(1)
})
