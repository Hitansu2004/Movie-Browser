/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel deployment optimization
  output: 'standalone',
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
    // Add image optimization for Vercel
    formats: ['image/webp', 'image/avif'],
  },
  
  // Ensure proper routing for dynamic pages
  trailingSlash: false,
  
  // Environment variables validation
  env: {
    NEXT_PUBLIC_TMDB_API_KEY: process.env.NEXT_PUBLIC_TMDB_API_KEY,
    NEXT_PUBLIC_TMDB_BASE_URL: process.env.NEXT_PUBLIC_TMDB_BASE_URL,
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
  
  // Add experimental features for better compatibility
  experimental: {
    // Ensure proper dynamic route handling
    serverComponentsExternalPackages: [],
  }
};

module.exports = nextConfig;
