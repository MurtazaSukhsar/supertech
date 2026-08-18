import NextImage, { type ImageProps } from 'next/image'

import { cldResize } from '@/lib/cloudinary-url'

/**
 * Drop-in replacement for `next/image` that pins `unoptimized` explicitly.
 *
 * Why this exists
 * ---------------
 * `next.config.mjs` sets `images: { unoptimized: true }`. Under Next 16.2.6
 * with Turbopack that config value reaches the server bundle but not the
 * client one, so the two render different markup for the same image:
 *
 *   server -> src="/images/logo.webp"          srcSet=null
 *   client -> src="/_next/image?url=..."       srcSet="/_next/image?url=..."
 *
 * React reports that as a hydration mismatch, and the `/_next/image` URLs the
 * client invents then 404, because the optimizer they point at is disabled by
 * that same config flag — so images visibly break after hydration.
 *
 * Passing `unoptimized` as an explicit prop sidesteps the broken config
 * plumbing entirely: the prop is part of the component call, so server and
 * client both see it and agree. Behaviour is identical to what the config
 * intended — images are served as-is from /public, untouched.
 *
 * If image optimization is ever wanted, delete this file, restore the plain
 * `next/image` imports, and remove `images.unoptimized` from next.config.mjs.
 * Changing the default here alone is not enough — the config flag has to go
 * too, or the optimizer route stays switched off and the URLs 404 again.
 *
 * Cloudinary sizing
 * ------------------
 * Because Next's optimizer is off, nothing was trimming Cloudinary images
 * down from their original upload resolution — a product shot uploaded at
 * 1536x1024 was shipped in full to render as a 268px card thumbnail. This
 * wrapper now runs every Cloudinary `src` through `cldResize`, so the actual
 * downloaded image is sized to what's on screen:
 *
 *   - Fixed-size images (`width` given, no `fill`): resized to `2 * width`
 *     (covers up to a 2x-DPR screen without over-fetching).
 *   - `fill` images: resized to `cldWidth` if the caller passes one (do this
 *     for anything wider than ~500px on screen — hero banners, category
 *     tiles, product grid photos), otherwise a conservative 1600px cap so a
 *     background image is never shipped at its raw 4000px original.
 *
 * Local `/images/...` paths and any non-Cloudinary src pass through
 * untouched — `cldResize` is a no-op for them.
 */
export function Image({
  src,
  width,
  cldWidth,
  ...props
}: ImageProps & { cldWidth?: number }) {
  const resizedSrc =
    typeof src === 'string'
      ? cldResize(src, cldWidth ?? (typeof width === 'number' ? width * 2 : 1600))
      : src

  return <NextImage {...props} width={width} src={resizedSrc} unoptimized />
}

export type { ImageProps }
