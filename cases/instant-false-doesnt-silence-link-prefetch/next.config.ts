import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The link-prefetch-partial warning only exists with Cache Components on.
  cacheComponents: true,
  // Note: partialPrefetching is intentionally NOT set here. Turning it on
  // app-wide is one of the things that silences the warning — leaving it off
  // is what lets us observe the warning and test the per-route opt-outs.
};

export default nextConfig;
