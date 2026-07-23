import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Partial Prefetching drives the static-shell / instant-navigation validation.
  // The insight this repro is about only surfaces with PPF on.
  partialPrefetching: true,
};

export default nextConfig;
