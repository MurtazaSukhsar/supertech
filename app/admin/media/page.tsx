import { MediaManager } from '@/components/admin/media-manager'
import { requireAdmin } from '@/lib/server/auth'

export const dynamic = 'force-dynamic'

export default async function AdminMediaPage() {
  await requireAdmin()
  return <MediaManager />
}
