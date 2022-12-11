import globby from "globby";
import { copyFile, mkdir } from "node:fs/promises";
import { basename, join } from "node:path";

const WEBSITE_ROOT = join(__dirname, "..");
const PROJECT_ROOT = join(WEBSITE_ROOT, "..");
const DEST_DIR = join(WEBSITE_ROOT, "tmp/api-models");

(async () => {
  await mkdir(DEST_DIR, { recursive: true });

  const files = await globby("packages/*/out/api-model.json", {
    cwd: PROJECT_ROOT,
    absolute: true
  });

  for (const file of files) {
    const unscopedName = basename(join(file, "../.."));
    const dest = join(DEST_DIR, `${unscopedName}.api.json`);

    console.log(`Copying ${file} to: ${dest}`);
    await copyFile(file, dest);
  }
})().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
