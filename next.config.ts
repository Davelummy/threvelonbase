import type { NextConfig } from "next";

/**
 * Netlify production build (OpenNext adapter via @netlify/plugin-nextjs).
 */
const nextConfig: NextConfig = {
  // Precompressed static assets work on Netlify without a remote optimizer.
  // next/image still provides explicit sizing and preload.
  images: {
    unoptimized: true,
    formats: ["image/webp", "image/avif"],
  },
};

export default nextConfig;
