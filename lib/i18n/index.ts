import { en, type Dictionary } from './dictionaries/en'
import { ar } from './dictionaries/ar'
import { defaultLocale, isLocale, type Locale } from './config'

const dictionaries: Record<Locale, Dictionary> = { en, ar }

type Plain = Record<string, unknown>

const isPlainObject = (value: unknown): value is Plain =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * Deep-merge admin overrides over the shipped dictionary.
 *
 * Only keys the admin has actually edited are stored, so an untouched string
 * keeps its original value and a newly added dictionary key needs no migration.
 */
export function mergeDictionary<T>(base: T, patch: unknown): T {
  if (!isPlainObject(patch)) return base
  if (!isPlainObject(base)) return (patch as T) ?? base

  const out: Plain = { ...base }
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined || value === null) continue
    const current = out[key]
    if (isPlainObject(value) && isPlainObject(current)) {
      out[key] = mergeDictionary(current, value)
    } else {
      out[key] = value
    }
  }
  return out as T
}

/**
 * Overrides live in Supabase, but `getDictionary` is called from ~38 mostly
 * synchronous spots. The layout primes this module-level copy once per request
 * before anything renders, which keeps those call sites unchanged.
 *
 * Safe to share across requests: page text is identical for every visitor.
 */
let runtimeOverrides: Partial<Record<Locale, unknown>> = {}

export function primeContentOverrides(overrides: Record<string, unknown>): void {
  runtimeOverrides = overrides as Partial<Record<Locale, unknown>>
}

export function getDictionary(locale: string): Dictionary {
  const key = isLocale(locale) ? locale : defaultLocale
  return mergeDictionary(dictionaries[key], runtimeOverrides[key])
}

/** The untouched shipped dictionary — used by the admin panel as a baseline. */
export function getBaseDictionary(locale: string): Dictionary {
  return dictionaries[isLocale(locale) ? locale : defaultLocale]
}

export type { Dictionary }
export * from './config'
