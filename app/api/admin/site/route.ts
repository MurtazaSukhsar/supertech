import { jsonOk, readBody, withAdmin } from '@/lib/server/api'
import { getSite, saveSite, type SiteData } from '@/lib/server/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = withAdmin(async () => jsonOk({ site: await getSite() }))

export const POST = withAdmin(async (request) => {
  const body = await readBody<Partial<SiteData>>(request)
  const current = await getSite()

  const contact = { ...current.contact, ...(body.contact ?? {}) }

  // Keep the tel:/wa.me links consistent with the displayed number so a phone
  // edit can't leave the buttons dialling the old one.
  const digits = String(contact.phone ?? '').replace(/[^\d+]/g, '')
  if (digits) {
    contact.phoneHref = `tel:${digits}`
    contact.whatsappHref = `https://wa.me/${digits.replace(/\D/g, '')}`
  }

  const next: SiteData = {
    contact,
    images: { ...current.images, ...(body.images ?? {}) },
  }

  await saveSite(next)
  return jsonOk({ site: next })
})
