import type { MetadataRoute } from "next";
import { siteOrigin } from "./data/business";

export default function sitemap(): MetadataRoute.Sitemap {
  // A sitemap URL is only useful when it points at the configured public site.
  if (!siteOrigin) return [];

  return [{ url: new URL("/", siteOrigin).toString() }];
}
