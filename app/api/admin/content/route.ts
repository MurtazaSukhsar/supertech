import { jsonError, jsonOk, readBody, withAdmin } from '@/lib/server/api'
import { getContentOverrides, saveContentOverrides } from '@/lib/server/store'
import { getBaseDictionary, locales, mergeDictionary, type Locale } from '@/lib/i18n'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Plain = Record<string, unknown>

const isPlainObject = (v: unknown): v is Plain =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

/**
 * Keep only the values that actually differ from the shipped dictionary.
 *
 * Storing the whole dictionary would freeze every string at today's wording —
 * a later code update to an untouched label would never reach the site. Saving
 * just the diff means edits survive updates and everything else stays live.
 */
function diff(base: unknown, edited: unknown): unknown {
  if (!isPlainObject(base) || !isPlainObject(edited)) {
    return JSON.stringify(base) === JSON.stringify(edited) ? undefined : edited
  }
  const out: Plain = {}
  for (const [key, value] of Object.entries(edited)) {
    const changed = diff(base[key], value)
    if (changed !== undefined) out[key] = changed
  }
  return Object.keys(out).length > 0 ? out : undefined
}

export const GET = withAdmin(async () => {
  const overrides = await getContentOverrides()
  const dictionaries = Object.fromEntries(
    locales.map((locale) => [locale, mergeDictionary(getBaseDictionary(locale), overrides[locale])]),
  )
  const defaults = Object.fromEntries(locales.map((l) => [l, getBaseDictionary(l)]))
  return jsonOk({ dictionaries, defaults, overrides })
})

export const POST = withAdmin(async (request) => {
  const body = await readBody<{ locale: Locale; dictionary: Plain }>(request)
  if (!locales.includes(body.locale)) return jsonError('Unknown language.')
  if (!isPlainObject(body.dictionary)) return jsonError('Expected a dictionary object.')

  const overrides = await getContentOverrides()
  overrides[body.locale] = diff(getBaseDictionary(body.locale), body.dictionary) ?? {}
  await saveContentOverrides(overrides)

  return jsonOk({ overrides })
})

/** Revert one language (or one top-level section) to the shipped wording. */
export const DELETE = withAdmin(async (request) => {
  const params = new URL(request.url).searchParams
  const locale = params.get('locale') as Locale | null
  const section = params.get('section')
  if (!locale || !locales.includes(locale)) return jsonError('Unknown language.')

  const overrides = await getContentOverrides()
  if (section && isPlainObject(overrides[locale])) {
    delete (overrides[locale] as Plain)[section]
  } else {
    overrides[locale] = {}
  }
  await saveContentOverrides(overrides)
  return jsonOk({ overrides })
})
