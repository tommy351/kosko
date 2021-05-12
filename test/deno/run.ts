import { expandGlob } from "https://deno.land/std@0.96.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.96.0/path/mod.ts";

const importMapPath = await Deno.makeTempFile();

async function writeImportMap() {
  const imports: Record<string, string> = {
    "@test/": path.dirname(path.fromFileUrl(import.meta.url)) + "/"
  };

  for await (const entry of expandGlob("packages/*/package.json")) {
    const pkg = await JSON.parse(await Deno.readTextFile(entry.path));
    imports[
      `https://cdn.skypack.dev/${pkg.name}@${pkg.version}/mod.ts`
    ] = path.join(entry.path, "../mod.ts");
  }

  console.log("");
  console.log("> Writing import map");
  console.log(imports);

  await Deno.writeTextFile(importMapPath, JSON.stringify({ imports }));
}

async function runTests() {
  const cmd = [
    "deno",
    "run",
    "--unstable",
    "--allow-read",
    "--allow-write",
    "--allow-env",
    "--import-map",
    importMapPath,
    "--location",
    "http://localhost",
    path.join(path.fromFileUrl(import.meta.url), "../test.ts")
  ];

  console.log("");
  console.log("> Running tests");
  console.log(cmd.join(" "));

  const p = Deno.run({
    cmd,
    stdout: "inherit",
    stderr: "inherit"
  });
  const status = await p.status();
  p.close();

  return status;
}

try {
  await writeImportMap();
  const status = await runTests();
  Deno.exit(status.code);
} finally {
  await Deno.remove(importMapPath);
}
