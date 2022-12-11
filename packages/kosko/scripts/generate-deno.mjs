import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { readPackageUp } from "read-pkg-up";

const TARGET_PATH = join(fileURLToPath(import.meta.url), "../../deno.js");
const CLI_PATH = await import.meta.resolve("@kosko/cli");
const CLI_PKG = await readPackageUp({ cwd: CLI_PATH });

await writeFile(
  TARGET_PATH,
  `import "npm:@kosko/cli@${CLI_PKG.packageJson.version}/deno.js";`
);
