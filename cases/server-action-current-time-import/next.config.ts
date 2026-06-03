import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    cachedNavigations: true,
  },
  typedRoutes: true,
};

export default nextConfig;

