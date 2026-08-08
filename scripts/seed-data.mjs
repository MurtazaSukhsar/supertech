// Seeds data/*.json from the existing TypeScript source modules.
// Run once: node scripts/seed-data.mjs
import { createJiti } from 'jiti'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const jiti = createJiti(import.meta.url, { alias: { '@': root } })

const dataDir = path.join(root, 'data')
fs.mkdirSync(dataDir, { recursive: true })

const write = (name, value) => {
  const file = path.join(dataDir, name)
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n')
  console.log('wrote', path.relative(root, file))
}

const products = await jiti.import('../lib/products.ts')
const content = await jiti.import('../lib/content.ts')
const en = (await jiti.import('../lib/i18n/dictionaries/en.ts')).en
const ar = (await jiti.import('../lib/i18n/dictionaries/ar.ts')).ar

write('products.json', products.products)
write('categories.json', products.categories)
write('faqs.json', content.faqs)
write('blog.json', content.blogPosts)
write('site.json', {
  contact: products.contactInfo,
  images: {
    logo: '/images/logo.webp',
    heroBackground: '/images/hero-warehouse.webp',
    aboutFacility: '/images/about-facility.webp',
    ctaBackground: '/images/hero-hvac-worker.webp',
  },
})
write('content.json', { en: {}, ar: {} })
write('dictionary-defaults.json', { en, ar })

const ar2 = await jiti.import('../lib/products-ar.ts')
const contentAr = await jiti.import('../lib/content-ar.ts')
write('translations-ar.json', {
  categories: ar2.categoryTranslationsAr,
  subcategories: ar2.subcategoryTranslationsAr,
  specKeys: ar2.specKeyTranslationsAr,
  products: ar2.productTranslationsAr,
})
write('faqs-ar.json', contentAr.faqsAr)
write('blog-ar.json', contentAr.blogPostsAr)
