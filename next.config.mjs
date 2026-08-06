/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    // Product photography is served from this site's own /public — no remote
    // hosts needed. Keeping the list empty means an accidental external <Image>
    // src fails the build instead of silently adding a third-party dependency.
    remotePatterns: []
  }
};

export default nextConfig;
