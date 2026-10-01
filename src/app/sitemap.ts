import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/insights/load";
import { postPath } from "@/lib/insights/paths";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE}/team`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/insights`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE}/contact`, changeFrequency: "yearly", priority: 0.5 },
    /* the coming-soon pages (the Core, what we build, how we start) are
       noindex and stay out until they are written */
    ...getAllPosts().map((post) => ({
      url: `${SITE}${postPath(post.slug)}`,
      lastModified: post.updated ?? post.published,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
