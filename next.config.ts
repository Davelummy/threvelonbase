import type { NextConfig } from "next";

/**
 * Netlify production build (OpenNext adapter via @netlify/plugin-nextjs).
 */
const nextConfig: NextConfig = {
  // Enable the Next.js image optimizer so content photos can emit srcset.
  // Wordmark SVGs stay unoptimized at the component. See Next 16.3 Image docs.
  images: {
    formats: ["image/webp", "image/avif"],
  },
  async redirects() {
    return [{ source: "/faq", destination: "/#faq", permanent: false }];
  },
};

export default nextConfig;
