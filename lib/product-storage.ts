import { products as staticProducts, Product } from './products'

const STORAGE_KEY = 'supertech_custom_products_v1'
const DELETED_KEY = 'supertech_deleted_product_ids_v1'

export function getStoredCustomProducts(): Product[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.error('Failed to read custom products from localStorage', e)
    return []
  }
}

export function getDeletedProductIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(DELETED_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.error('Failed to read deleted product IDs', e)
    return []
  }
}

export function getAllActiveProducts(): Product[] {
  const custom = getStoredCustomProducts()
  const deletedIds = new Set(getDeletedProductIds())

  // Overwrite static products with custom edited ones if IDs match
  const customMap = new Map(custom.map((p) => [p.id, p]))

  const mergedStatic = staticProducts
    .filter((p) => !deletedIds.has(p.id))
    .map((p) => customMap.get(p.id) || p)

  // Append new custom products that were not in static list
  const staticIds = new Set(staticProducts.map((p) => p.id))
  const newCustom = custom.filter((p) => !staticIds.has(p.id) && !deletedIds.has(p.id))

  return [...mergedStatic, ...newCustom]
}

export function saveProductToStorage(product: Product): Product[] {
  if (typeof window === 'undefined') return []
  try {
    const custom = getStoredCustomProducts()
    const index = custom.findIndex((p) => p.id === product.id)
    if (index >= 0) {
      custom[index] = product
    } else {
      custom.push(product)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(custom))
    // Also remove from deleted IDs if re-saved
    const deleted = getDeletedProductIds().filter((id) => id !== product.id)
    localStorage.setItem(DELETED_KEY, JSON.stringify(deleted))
  } catch (e) {
    console.error('Failed to save product to localStorage', e)
  }
  return getAllActiveProducts()
}

export function deleteProductFromStorage(productId: string): Product[] {
  if (typeof window === 'undefined') return []
  try {
    // Remove from custom list
    const custom = getStoredCustomProducts().filter((p) => p.id !== productId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(custom))

    // Mark as deleted
    const deleted = getDeletedProductIds()
    if (!deleted.includes(productId)) {
      deleted.push(productId)
      localStorage.setItem(DELETED_KEY, JSON.stringify(deleted))
    }
  } catch (e) {
    console.error('Failed to delete product from localStorage', e)
  }
  return getAllActiveProducts()
}

export function resetStorageToDefault(): Product[] {
  if (typeof window === 'undefined') return staticProducts
  try {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(DELETED_KEY)
  } catch (e) {
    console.error('Failed to reset localStorage', e)
  }
  return staticProducts
}
