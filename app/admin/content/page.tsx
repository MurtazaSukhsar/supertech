import { ContentEditor } from '@/components/admin/content-editor'
import { requireAdmin } from '@/lib/server/auth'
import { getBaseDictionary, locales, mergeDictionary } from '@/lib/i18n'
import { getContentOverrides } from '@/lib/server/store'

export const dynamic = 'force-dynamic'

export default async function AdminContentPage() {
  await requireAdmin()
  const overrides = await getContentOverrides()

  const dictionaries = Object.fromEntries(
    locales.map((locale) => [
      locale,
      mergeDictionary(getBaseDictionary(locale), overrides[locale]) as Record<string, unknown>,
    ]),
  )
  const defaults = Object.fromEntries(
    locales.map((locale) => [locale, getBaseDictionary(locale) as unknown as Record<string, unknown>]),
  )

  return <ContentEditor dictionaries={dictionaries} defaults={defaults} />
}
