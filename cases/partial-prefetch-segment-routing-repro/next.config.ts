import type { NextConfig } from "next";
import { withEve } from "eve/next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
};

export default process.env.WITH_EVE === "false" ? nextConfig : withEve(nextConfig);
