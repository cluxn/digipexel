import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
  },
  // In dev mode, skip static export so local API routes work.
  // In production (next build for Hostinger), use static export as before.
  ...(isDev ? {} : { output: 'export' }),
  trailingSlash: true,
};

export default nextConfig;
