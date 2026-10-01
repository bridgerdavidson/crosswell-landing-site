import type { MetadataRoute } from "next";

export const dynamic = "force-static";

/* Everyone may crawl. The three AI crawlers are named as well, per the
   content brief: the posts are written to be cited by AI assistants. No
   llms.txt (almost none are ever fetched). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
    ],
    sitemap: "https://crosswellconsulting.com/sitemap.xml",
  };
}
