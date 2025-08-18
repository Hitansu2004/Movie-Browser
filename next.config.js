/** @type {import('next').NextConfig} */
// Simplified config: removed aggressive custom optimization / experimental flags that can break
// module factories in the App Router (causing "Cannot read properties of undefined (reading 'call')").
// Re‑add selectively once the app is stable.
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        fs: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
