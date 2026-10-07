import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: false,
  experimental: {
    agentFeedback: true,
  },
};

export default nextConfig;
