import type { NextConfig } from "next";

/**
 * Netlify runs a standard Next.js production build (OpenNext adapter).
 * Local/ChatGPT Sites development continues to use Vite + Vinext via
 * `npm run dev` / `npm run build:sites`.
 */
const nextConfig: NextConfig = {
  // Keep marketing assets portable across hosts.
  images: {
    unoptimized: false,
  },
};

export default nextConfig;
