import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  typescript: {
    // The locally packed eval artifact omits generated declaration files.
    ignoreBuildErrors: true,
  },
  experimental: {
    exposeTestingApiInProductionBuild: true,
  },
}

export default nextConfig
