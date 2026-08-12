import type { MetadataRoute } from "next";
import { absoluteSiteUrl, siteOrigin } from "./data/business";

const publicPaths = ["/", "/faq", "/privacy"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  // Sitemap URLs are only useful when they point at the configured public site.
  if (!siteOrigin) return [];

  return publicPaths.flatMap((path) => {
    const url = absoluteSiteUrl(path);
    return url ? [{ url }] : [];
  });
}
