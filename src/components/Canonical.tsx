import { SITE } from "@/lib/site";

/*
 * The page's canonical link, rendered by the page itself. React 19 hoists a
 * <link> rendered anywhere in the tree into the document head. It is not
 * metadata.alternates.canonical because, for the root path, Next's own
 * resolver (resolveAbsoluteUrlWithPathname) collapses the URL to the bare
 * origin and only re-adds the trailing slash when next.config sets
 * trailingSlash, which this static export does not set.
 */
export default function Canonical({ path }: { path: string }) {
  return <link rel="canonical" href={`${SITE}${path}`} />;
}
