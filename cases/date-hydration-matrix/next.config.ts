import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  agentRules: false,
  experimental: {
    agentUpgrade: false,
  },
};

export default nextConfig;
