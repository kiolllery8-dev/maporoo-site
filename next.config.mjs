/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "maporoo.com" },
      // Product photography is served from the shared Auslife CDN.
      { protocol: "https", hostname: "cdn.auslife.tw" }
    ]
  }
};

export default nextConfig;
