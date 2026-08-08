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
}

export default nextConfig
