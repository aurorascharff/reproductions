import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    appShells: true,
    useOffline: true,
  },
  partialPrefetching: true,
};

export default nextConfig;
