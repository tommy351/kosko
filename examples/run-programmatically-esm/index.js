import env from "@kosko/env";
import { generate, print, PrintFormat } from "@kosko/generate";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

// Set environment
env.env = "dev";

// Set CWD (optional)
env.cwd = fileURLToPath(new URL("./", import.meta.url));

// Generate manifests
const result = await generate({
  path: join(env.cwd, "components"),
  components: ["*"]
});

// Print manifests to stdout
print(result, {
  format: PrintFormat.YAML,
  writer: process.stdout
});
