/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  async redirects() {
    return [
      { source: "/über/:path*", destination: "/target/", statusCode: 301 },
      { source: "/uber/:path*", destination: "/target/", statusCode: 301 },
      {
        source: "/%C3%BCber-encoded/:path*",
        destination: "/target/",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
