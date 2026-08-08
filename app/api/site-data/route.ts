import { NextResponse } from 'next/server'

import { getSiteData } from '@/lib/server/site-data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Public snapshot of the live catalogue.
 *
 * A browser that loaded the site before an admin edit still holds the old data
 * in its bundle. <I18nProvider> fetches this on mount and pushes the result
 * into the runtime cache, so edits show up without a rebuild.
 */
export async function GET() {
  try {
    const { products, categories, site, translationsAr } = await getSiteData()
    return NextResponse.json(
      {
        products,
        categories,
        contact: site.contact,
        images: site.images,
        translationsAr,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    // The page already rendered from server data; a failure here just means
    // the client keeps what it has rather than showing an error.
    console.error('[site-data]', (error as Error).message)
    return NextResponse.json({ error: 'unavailable' }, { status: 503 })
  }
}
