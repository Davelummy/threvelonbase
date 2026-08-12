import type { MetadataRoute } from "next";
import { absoluteSiteUrl } from "./data/business";

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = absoluteSiteUrl("/sitemap.xml");

  return {
    rules: { userAgent: "*", allow: "/" },
    ...(sitemapUrl ? { sitemap: sitemapUrl } : {}),
  };
}
