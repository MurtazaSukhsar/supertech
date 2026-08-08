import { SiteSettings } from '@/components/admin/site-settings'
import { requireAdmin } from '@/lib/server/auth'
import { getSite } from '@/lib/server/store'

export const dynamic = 'force-dynamic'

export default async function AdminSitePage() {
  await requireAdmin()
  const site = await getSite()
  return <SiteSettings site={site} />
}
