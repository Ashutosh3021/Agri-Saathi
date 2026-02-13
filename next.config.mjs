/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      // Map /volunteers to /Volunteers (case-insensitive routing fix)
      {
        source: '/volunteers',
        destination: '/Volunteers',
      },
      {
        source: '/volunteers/:path*',
        destination: '/Volunteers/:path*',
      },
      // Handle auth callback with error
      {
        source: '/auth/callback',
        destination: '/auth/callback',
      },
    ]
  },
}

export default nextConfig
