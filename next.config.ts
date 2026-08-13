import type { NextConfig } from "next";

/**
 * Netlify production build (OpenNext adapter via @netlify/plugin-nextjs).
 */
const documentSecurityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), display-capture=(), browsing-topics=()",
  },
  // Framing only. Do not add script-src: the theme bootstrap and JSON-LD are inline.
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
];

const nextConfig: NextConfig = {
  // Next 16.3 docs: https://nextjs.org/docs/app/api-reference/config/next-config-js/poweredByHeader
  poweredByHeader: false,
  // Enable the Next.js image optimizer so content photos can emit srcset.
  // Wordmark SVGs stay unoptimized at the component. See Next 16.3 Image docs.
  images: {
    formats: ["image/webp", "image/avif"],
  },
  async headers() {
    return [
      { source: "/", headers: documentSecurityHeaders },
      { source: "/privacy", headers: documentSecurityHeaders },
      { source: "/faq", headers: documentSecurityHeaders },
      {
        source: "/images/:path*",
        headers: [{ key: "X-Content-Type-Options", value: "nosniff" }],
      },
      {
        source: "/brand/:path*",
        headers: [{ key: "X-Content-Type-Options", value: "nosniff" }],
      },
    ];
  },
  async redirects() {
    return [{ source: "/faq", destination: "/#faq", permanent: false }];
  },
};

export default nextConfig;
