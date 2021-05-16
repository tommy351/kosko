import { expandGlob } from "https://deno.land/std@0.96.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.96.0/path/mod.ts";

const importMapPath = await Deno.makeTempFile();
const __filename = path.fromFileUrl(import.meta.url);
const __dirname = path.dirname(__filename);

async function writeImportMap() {
  const imports: Record<string, string> = {
    "@test/": `${path.toFileUrl(__dirname)}/`,
    "kubernetes-models/": "https://cdn.skypack.dev/kubernetes-models@1.5.4/"
  };

  for await (const entry of expandGlob("packages/*/package.json")) {
    const pkg = await JSON.parse(await Deno.readTextFile(entry.path));
    imports[`https://cdn.skypack.dev/${pkg.name}@${pkg.version}/mod.ts`] =
      path.toFileUrl(path.dirname(entry.path)) + "/mod.ts";
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
    "--allow-net",
    "--import-map",
    importMapPath,
    "--location",
    "http://localhost",
    path.join(__dirname, "test.ts")
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
