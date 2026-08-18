/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Cloudinary already serves f_auto/q_auto, so Next's optimizer would just
    // be a second pass over an already-optimal image.
    unoptimized: true,
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
  },
  turbopack: {
    root: process.cwd(),
  },
  // Static assets under /public are served with no caching by default in a
  // custom Node server (server.js). Filenames here aren't content-hashed, so
  // this is a moderate TTL rather than `immutable` — long enough that repeat
  // visits stop re-downloading the same product photos and fonts, short
  // enough that swapping a file in /public (e.g. via the admin media
  // manager) is visible within a day instead of being cached indefinitely.
  async headers() {
    const CACHE_CONTROL = 'public, max-age=86400, stale-while-revalidate=604800'
    return [
      { source: '/images/:path*', headers: [{ key: 'Cache-Control', value: CACHE_CONTROL }] },
      { source: '/fonts/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
      { source: '/videos/:path*', headers: [{ key: 'Cache-Control', value: CACHE_CONTROL }] },
    ]
  },
}

export default nextConfig
