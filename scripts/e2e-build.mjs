// Builds the site for the e2e tests with the invented fixture posts
// (tests/fixtures/insights) in place of the real ones. Fixture images are
// copied into public/media/insights for the build and removed after it,
// with every generated fixture folder, so none of it can ship (they are
// git-ignored as well).
import { cpSync, existsSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const FIXTURES = join("tests", "fixtures", "insights");
const MEDIA = join("public", "media", "insights");

const clean = () => {
  if (!existsSync(MEDIA)) return;
  for (const name of readdirSync(MEDIA)) {
    if (name.startsWith("fixture-")) rmSync(join(MEDIA, name), { recursive: true, force: true });
  }
};

clean();
cpSync(join(FIXTURES, "media"), MEDIA, { recursive: true });
let status = 1;
try {
  status = spawnSync("npm", ["run", "build"], { stdio: "inherit", env: { ...process.env, INSIGHTS_DIR: FIXTURES } }).status ?? 1;
} finally {
  clean();
}
process.exit(status);
