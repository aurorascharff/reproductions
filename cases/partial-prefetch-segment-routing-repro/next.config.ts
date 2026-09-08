import type { NextConfig } from "next";
import { withEve } from "eve/next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: process.env.PARTIAL_PREFETCHING !== "false",
};

export default withEve(nextConfig);
