import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://crosswellconsulting.com/", changeFrequency: "monthly", priority: 1 },
    { url: "https://crosswellconsulting.com/team", changeFrequency: "monthly", priority: 0.6 },
    { url: "https://crosswellconsulting.com/insights", changeFrequency: "weekly", priority: 0.6 },
  ];
}
