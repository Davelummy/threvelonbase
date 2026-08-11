import type { MetadataRoute } from "next";
import { siteOrigin } from "./data/business";

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = siteOrigin
    ? new URL("/sitemap.xml", siteOrigin).toString()
    : undefined;

  return {
    rules: { userAgent: "*", allow: "/" },
    ...(sitemapUrl ? { sitemap: sitemapUrl } : {}),
  };
}
