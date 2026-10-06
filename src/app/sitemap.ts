import type { MetadataRoute } from "next";
import { categories, getCategoryTools, tools } from "@/lib/tools";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = tools.map((tool) => ({
    url: `${siteUrl}/tools/${tool.slug}`,
  }));
  const categoryPages = categories
    .filter((category) => getCategoryTools(category.slug).length > 0)
    .map((category) => ({ url: `${siteUrl}/${category.slug}` }));

  return [
    { url: siteUrl, priority: 1 },
    ...categoryPages,
    ...toolPages,
    { url: `${siteUrl}/privacy` },
    { url: `${siteUrl}/terms` },
  ];
}