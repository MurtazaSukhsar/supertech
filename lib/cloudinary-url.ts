/**
 * Rewrites a Cloudinary delivery URL to request a specific max width, so the
 * browser downloads pixels close to what it will actually render instead of
 * the original upload resolution.
 *
 * Why this exists: `next.config.mjs` sets `images.unoptimized = true` (see
 * `components/site-image.tsx` for why), which means Next's own image
 * optimizer never runs — the `sizes`/`fill` props on `next/image` only affect
 * layout, not how many bytes get downloaded. Cloudinary is already the CDN
 * for product/category imagery and already serves `f_auto,q_auto` (modern
 * format + auto quality); this adds the missing `w_<n>,c_limit` so it also
 * stops shipping full-resolution originals for a 200px thumbnail.
 *
 * Safe to call on any string — URLs that aren't Cloudinary delivery URLs
 * (local `/images/...` paths, data URLs, relative placeholders, etc.) are
 * returned unchanged. Idempotent: calling it again on an already-resized URL
 * replaces the existing width rather than stacking another transform
 * segment.
 */
export function cldResize(src: string, width: number): string {
  if (!src || !src.includes('res.cloudinary.com')) return src

  const w = Math.max(1, Math.round(width))
  const marker = '/upload/'
  const idx = src.indexOf(marker)
  if (idx === -1) return src

  const head = src.slice(0, idx + marker.length)
  const rest = src.slice(idx + marker.length)
  const segments = rest.split('/')
  const firstSegment = segments[0] ?? ''

  // A transformation segment looks like `f_auto,q_auto` or `w_400,c_limit`.
  // A version segment looks like `v1234567890` — never treat that as one.
  const looksLikeTransform = /^[a-z]{1,3}_[^/]+(,[a-z]{1,3}_[^/]+)*$/i.test(firstSegment)
  const isVersion = /^v\d+$/i.test(firstSegment)

  let transformParts: string[]
  let remainderSegments: string[]

  if (looksLikeTransform && !isVersion) {
    transformParts = firstSegment
      .split(',')
      .filter((p) => !/^w_\d+$/i.test(p) && !/^h_\d+$/i.test(p) && p.toLowerCase() !== 'c_limit')
    remainderSegments = segments.slice(1)
  } else {
    transformParts = ['f_auto', 'q_auto']
    remainderSegments = segments
  }

  transformParts.push(`w_${w}`, 'c_limit')

  return `${head}${transformParts.join(',')}/${remainderSegments.join('/')}`
}
