import NextImage, { type ImageProps } from 'next/image'

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
 */
export function Image(props: ImageProps) {
  return <NextImage {...props} unoptimized />
}

export type { ImageProps }
