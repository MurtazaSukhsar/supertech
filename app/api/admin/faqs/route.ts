import type { Faq } from '@/lib/content'
import { jsonError, jsonOk, readBody, withAdmin } from '@/lib/server/api'
import { getFaqs, saveFaqs } from '@/lib/server/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = withAdmin(async () =>
  jsonOk({ en: await getFaqs('en'), ar: await getFaqs('ar') }),
)

export const POST = withAdmin(async (request) => {
  const body = await readBody<{ locale?: string; faqs: Faq[] }>(request)
  if (!Array.isArray(body.faqs)) return jsonError('Expected a list of FAQs.')

  const cleaned = body.faqs
    .map((faq) => ({ question: faq.question?.trim() ?? '', answer: faq.answer?.trim() ?? '' }))
    .filter((faq) => faq.question && faq.answer)

  const locale = body.locale === 'ar' ? 'ar' : 'en'
  await saveFaqs(cleaned, locale)
  return jsonOk({ faqs: cleaned })
})
