import type { NextConfig } from "next";

/**
 * Netlify runs a standard Next.js production build (OpenNext adapter).
 * Local/ChatGPT Sites development continues to use Vite + Vinext via
 * `npm run dev` / `npm run build:sites`.
 */
const nextConfig: NextConfig = {
  // Precompressed static assets work on Netlify and Vinext/Sites without a
  // remote optimizer. next/image still provides explicit sizing + priority.
  images: {
    unoptimized: true,
    formats: ["image/webp", "image/avif"],
  },
};

export default nextConfig;
