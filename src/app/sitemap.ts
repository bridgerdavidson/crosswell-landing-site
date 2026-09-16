import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://crosswellconsulting.com/", changeFrequency: "monthly", priority: 1 },
    { url: "https://crosswellconsulting.com/team", changeFrequency: "monthly", priority: 0.6 },
    { url: "https://crosswellconsulting.com/insights", changeFrequency: "weekly", priority: 0.6 },
    { url: "https://crosswellconsulting.com/contact", changeFrequency: "yearly", priority: 0.5 },
    /* the coming-soon pages (the Core, what we build, how we start) are
       noindex and stay out until they are written */
  ];
}
