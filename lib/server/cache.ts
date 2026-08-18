import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * Cache invalidation for the catalogue.
 *
 * Why this isn't a plain module-level variable: route handlers and page
 * renders run in separate module instances, so a counter bumped by an admin
 * write is invisible to the renderer — edits would only appear once a TTL
 * lapsed. Next's data cache is shared across both, and `revalidateTag`
 * propagates, so it is the only invalidation that actually works here —
 * *within a single running process*. See `bustRemoteCache` below for why
 * that qualifier matters on this deployment.
 */

export const CATALOG_TAG = 'catalog'

function bustLocalCache(): void {
  try {
    // Next.js 16 changed revalidateTag's recommended second argument:
    // 'max' is LAZY — it only marks the tag stale and waits for a page to
    // be "next visited" before it starts a background refetch, and even
    // that visit still serves the old content while the refetch runs. That
    // silently reproduced this exact bug (admin writes taking an
    // unpredictable amount of time — sometimes several requests — to reach
    // the public site). `{ expire: 0 }` is Next's own documented recipe for
    // "a webhook/route handler needs this to take effect immediately,"
    // which is exactly this case: an admin write must be visible on the
    // very next request, not eventually.
    revalidateTag(CATALOG_TAG, { expire: 0 })
    // Drops the rendered HTML too, so prerendered pages pick the change up
    // rather than serving the previous build's markup.
    revalidatePath('/', 'layout')
  } catch {
    // Outside a request scope (the migration script) there is nothing cached
    // to invalidate. The write already happened; only the hint is skipped.
  }
}

/**
 * Root-cause note (products created on the admin domain not appearing on
 * the public domain): `revalidateTag`/`revalidatePath` only ever bust the
 * cache of the process that calls them. On Hostinger's Node.js hosting, the
 * admin domain (supertechintl.in) and the public domain (supertechint.com.kw)
 * can end up running as two separate `next start` processes — each with its
 * own in-memory Data Cache and its own `.next/cache` on disk — even though
 * both were deployed from the same repo and read the same Supabase database.
 * The write itself always lands in Supabase correctly (same adminClient(),
 * same NEXT_PUBLIC_SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY on both); what
 * doesn't cross the process boundary is the "please refetch" signal.
 *
 * The fix is to also send that signal over HTTP: hit the public site's own
 * `/api/revalidate` route after every write, so whichever process is
 * actually serving supertechint.com.kw busts its own cache directly. This
 * is correct (and just a harmless no-op extra call) even if it turns out
 * both domains *are* served by the same process — so it doesn't depend on
 * confirming the exact Hostinger process topology to be the right fix.
 *
 * Fire-and-forget on purpose: an admin save must not be slowed down or
 * fail because the public site is briefly unreachable.
 */
function bustRemoteCache(): void {
  const secret = process.env.REVALIDATE_SECRET
  const target = process.env.NEXT_PUBLIC_SITE_URL

  if (!secret || !target) {
    console.warn(
      '[cache] REVALIDATE_SECRET or NEXT_PUBLIC_SITE_URL is not set — skipping cross-domain ' +
        'cache invalidation. If the admin and public domains run as separate processes, writes ' +
        "won't be visible on the public site until its 300s backstop revalidate window lapses.",
    )
    return
  }

  const url = `${target.replace(/\/+$/, '')}/api/revalidate?secret=${encodeURIComponent(secret)}&tag=${CATALOG_TAG}`

  fetch(url, { method: 'POST' })
    .then(async (res) => {
      if (!res.ok) {
        console.error('[cache] remote revalidate failed:', res.status, await res.text().catch(() => ''))
      }
    })
    .catch((error) => {
      console.error('[cache] remote revalidate request failed:', (error as Error).message)
    })
}

/** Called after every admin write. */
export function bustCatalog(): void {
  bustLocalCache()
  bustRemoteCache()
}
