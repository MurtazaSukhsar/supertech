import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'

import { CATALOG_TAG } from '@/lib/server/cache'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * On-demand cache invalidation, callable over HTTP so a write handled by one
 * process (the admin domain) can bust the cache of a *different* process
 * (the public domain) when Hostinger runs them separately. See
 * lib/server/cache.ts for the full explanation of why this exists.
 *
 * Auth is a shared secret (REVALIDATE_SECRET) rather than the Supabase
 * session cookie, since the caller here is server-to-server, not a signed-in
 * browser — and cookies wouldn't cross the domain boundary anyway.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET
  const provided = request.nextUrl.searchParams.get('secret')

  if (!secret || provided !== secret) {
    return NextResponse.json({ ok: false, error: 'Invalid or missing secret.' }, { status: 401 })
  }

  const tag = request.nextUrl.searchParams.get('tag') || CATALOG_TAG

  // See lib/server/cache.ts's bustLocalCache for why { expire: 0 } and not
  // 'max' — 'max' is lazy in Next.js 16 and won't take effect immediately.
  revalidateTag(tag, { expire: 0 })
  revalidatePath('/', 'layout')

  return NextResponse.json({ ok: true, tag, revalidatedAt: Date.now() })
}
