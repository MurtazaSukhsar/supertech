import { FaqManager } from '@/components/admin/faq-manager'
import { requireAdmin } from '@/lib/server/auth'
import { getFaqs } from '@/lib/server/store'

export const dynamic = 'force-dynamic'

export default async function AdminFaqsPage() {
  await requireAdmin()
  const [en, ar] = await Promise.all([getFaqs('en'), getFaqs('ar')])
  return <FaqManager initial={{ en, ar }} />
}
