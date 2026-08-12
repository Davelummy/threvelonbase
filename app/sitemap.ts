import type { MetadataRoute } from "next";
import { absoluteSiteUrl, siteOrigin } from "./data/business";

export default function sitemap(): MetadataRoute.Sitemap {
  // A sitemap URL is only useful when it points at the configured public site.
  const homepageUrl = absoluteSiteUrl("/");
  if (!siteOrigin || !homepageUrl) return [];

  return [{ url: homepageUrl }];
}
