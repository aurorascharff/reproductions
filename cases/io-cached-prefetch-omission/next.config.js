/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  cacheHandlers: {
    remote: require.resolve(
      'next/dist/server/lib/cache-handlers/default.external'
    ),
  },
}

module.exports = nextConfig
