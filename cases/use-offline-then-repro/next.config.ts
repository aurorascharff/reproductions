import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    cachedNavigations: true,
    prefetchInlining: true,
    useOffline: true,
  },
};

export default nextConfig;
