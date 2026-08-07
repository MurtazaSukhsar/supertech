/**
 * Length helpers for metadata built at runtime from catalogue data.
 *
 * Google truncates titles at roughly 60 characters and descriptions at
 * roughly 160. A truncated title loses the trailing brand or location, which
 * is exactly the part that matters for local search — so titles assembled
 * from variable-length product and category names get clamped here rather
 * than hoping the source strings stay short.
 */

/** Titles render as `<page> | <brand>`; keep the whole thing under this. */
export const TITLE_MAX = 60
export const DESCRIPTION_MAX = 158

/**
 * Trim to `max` characters on a word boundary, appending an ellipsis only
 * when text was actually removed. Never cuts mid-word, which reads as broken.
 */
export function clamp(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean

  // Reserve one character for the ellipsis.
  const slice = clean.slice(0, max - 1)
  const lastSpace = slice.lastIndexOf(' ')
  const cut = lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice

  return `${cut.replace(/[,.;:—–-]$/, '')}…`
}

/**
 * Build a description from a lead sentence plus an optional call-to-action,
 * dropping the CTA entirely when there is no room for it. A half-cut CTA is
 * worse than none.
 */
export function description(lead: string, cta?: string): string {
  const base = lead.replace(/\s+/g, ' ').trim()
  if (!cta) return clamp(base, DESCRIPTION_MAX)

  const joined = `${base} ${cta.trim()}`
  if (joined.length <= DESCRIPTION_MAX) return joined

  return clamp(base, DESCRIPTION_MAX)
}

/**
 * Build a page title that still fits once the layout appends
 * `titleTemplate`. Pass the template so the reserved length is exact.
 */
export function title(text: string, template: string): string {
  const reserved = template.replace('%s', '').length
  return clamp(text, TITLE_MAX - reserved)
}
