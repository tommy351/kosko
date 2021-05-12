/* eslint-disable node/no-unpublished-import */
import execa from "execa";
import tmp from "tmp-promise";
import fs from "fs-extra";
import globby from "globby";
import { join } from "path";

(async () => {
  const file = await tmp.file({
    postfix: ".json"
  });
  const imports: Record<string, string> = {};

  try {
    const packages = await globby("packages/*/package.json", {
      absolute: true
    });

    for (const path of packages) {
      const pkg = await fs.readJSON(path);
      imports[
        `https://cdn.skypack.dev/${pkg.name}@${pkg.version}/mod.ts`
      ] = join(path, "../mod.ts");
    }

    await fs.outputJSON(file.path, { imports });

    await execa(
      "deno",
      [
        "test",
        "--unstable",
        "--allow-read",
        "--allow-write",
        "--allow-env",
        "--import-map",
        file.path,
        ...(await globby("packages/*/test/deno/**/*.ts")),
        ...process.argv.slice(2)
      ],
      {
        stdio: "inherit"
      }
    );
  } finally {
    await file.cleanup();
  }
})().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
