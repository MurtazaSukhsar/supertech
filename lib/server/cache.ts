import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * Cache invalidation for the catalogue.
 *
 * Why this isn't a plain module-level variable: route handlers and page
 * renders run in separate module instances, so a counter bumped by an admin
 * write is invisible to the renderer — edits would only appear once a TTL
 * lapsed. Next's data cache is shared across both, and `revalidateTag`
 * propagates, so it is the only invalidation that actually works here.
 */

export const CATALOG_TAG = 'catalog'

/** Called after every admin write. */
export function bustCatalog(): void {
  try {
    revalidateTag(CATALOG_TAG, 'max')
    // Drops the rendered HTML too, so prerendered pages pick the change up
    // rather than serving the previous build's markup.
    revalidatePath('/', 'layout')
  } catch {
    // Outside a request scope (the migration script) there is nothing cached
    // to invalidate. The write already happened; only the hint is skipped.
  }
}
