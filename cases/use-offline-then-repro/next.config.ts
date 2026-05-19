import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    cachedNavigations: true,
    instantNavigationDevToolsToggle: true,
    optimisticRouting: true,
    prefetchInlining: true,
    useOffline: true,
    varyParams: true,
  },
};

export default nextConfig;
