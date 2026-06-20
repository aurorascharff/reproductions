import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enabling Cache Components turns every blocking route into a build error.
  cacheComponents: true,
};

export default nextConfig;
