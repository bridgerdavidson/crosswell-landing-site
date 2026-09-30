// npm run check:insights: every post in the content folder, checked by the
// same code the build uses, in about a second. The publishing command runs
// it before every preview. INSIGHTS_DIR and INSIGHTS_MEDIA_DIR point it at
// another folder.
import { contentDir, loadPosts } from "@/lib/insights/load";
import { InsightError } from "@/lib/insights/types";

const dir = contentDir();
try {
  const posts = loadPosts(dir);
  console.log(`insights: ${posts.length} post${posts.length === 1 ? "" : "s"} checked, all valid (${dir})`);
} catch (e) {
  if (!(e instanceof InsightError)) throw e;
  console.error(e.message);
  console.error(`\ninsights: ${e.problems.length} problem${e.problems.length === 1 ? "" : "s"} to fix`);
  process.exit(1);
}
