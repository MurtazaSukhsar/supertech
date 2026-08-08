import categoriesData from '@/data/categories.json'
import productsData from '@/data/products.json'
import { getRuntimeProducts, getRuntimeCategories } from './product-storage'

export type Category = {
  slug: string
  name: string
  shortName: string
  description: string
  icon: string
  image: string
  subcategories: string[]
}

export type Product = {
  id: string
  name: string
  category: string
  subcategory: string
  brand?: string
  images: string[]
  description: string
  specs: Record<string, string>
  featured?: boolean
}

export type SiteImages = {
  logo: string
  heroBackground: string
  aboutFacility: string
  ctaBackground: string
  [key: string]: string
}

export type ContactInfo = {
  companyName: string
  tagline: string
  email: string
  phone: string
  phoneHref: string
  whatsappHref: string
  instagramHref: string
  address: string
  googleMapsUrl: string
  [key: string]: string
}

/**
 * Supabase is the source of truth. The JSON files are the committed seed —
 * they keep the site renderable before the first database read resolves, and
 * they are what `scripts/migrate-to-supabase.mjs` pushes up on first run.
 *
 * Everything rendered in the app goes through the helpers below, which prefer
 * the live copy primed by the layout (server) and the i18n provider (client).
 */
export const categories: Category[] = categoriesData as unknown as Category[]
export const products: Product[] = productsData as unknown as Product[]

// Re-exported from the runtime cache: same object identity, mutated in place
// when live data arrives, so every existing `contactInfo.phone` keeps working.
export { contactInfo, siteImages } from './product-storage'

function getProductSource(): Product[] {
  return getRuntimeProducts() ?? products
}

function getCategorySource(): Category[] {
  return getRuntimeCategories() ?? categories
}

export function getCategories(): Category[] {
  return getCategorySource()
}

export function getCategory(slug: string): Category | undefined {
  return getCategorySource().find((c) => c.slug === slug)
}

export function getCategoryColor(slug: string): { bg: string; text: string; ring: string; hex: string } {
  switch (slug) {
    case 'air-conditioning':
      return { bg: 'bg-blue-500/10', text: 'text-blue-500', ring: 'ring-blue-500/30', hex: '#3b82f6' }
    case 'hardware':
      return { bg: 'bg-amber-500/10', text: 'text-amber-500', ring: 'ring-amber-500/30', hex: '#f59e0b' }
    case 'tools':
      return { bg: 'bg-red-500/10', text: 'text-red-500', ring: 'ring-red-500/30', hex: '#ef4444' }
    case 'construction':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-500', ring: 'ring-emerald-500/30', hex: '#10b981' }

    case 'plumbing':
      return { bg: 'bg-cyan-500/10', text: 'text-cyan-500', ring: 'ring-cyan-500/30', hex: '#06b6d4' }
    case 'electric':
      return { bg: 'bg-amber-500/10', text: 'text-amber-500', ring: 'ring-amber-500/30', hex: '#f59e0b' }
    case 'clamps':
      return { bg: 'bg-zinc-500/10', text: 'text-zinc-500', ring: 'ring-zinc-500/30', hex: '#71717a' }
    default:
      return { bg: 'bg-accent/10', text: 'text-accent', ring: 'ring-accent/30', hex: '#D91E2A' }
  }
}

export function getProduct(id: string): Product | undefined {
  const source = getProductSource()
  return source.find((p) => p.id === id)
}

export function getProductsByCategory(slug: string): Product[] {
  const source = getProductSource()
  return source.filter((p) => p.category === slug)
}

export function getFeaturedProducts(): Product[] {
  const source = getProductSource()
  return source.filter((p) => p.featured)
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const source = getProductSource()
  return source
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit)
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const source = getProductSource()
  return source.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q) ||
      (p.brand ?? '').toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  )
}

export function getAllProducts(): Product[] {
  return getProductSource()
}
