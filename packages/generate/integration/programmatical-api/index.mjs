import env from "@kosko/env";
import { generate, print, PrintFormat } from "@kosko/generate";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

env.env = "dev";
env.cwd = fileURLToPath(new URL("./", import.meta.url));

const result = await generate({
  path: join(env.cwd, "components"),
  components: ["*"]
});

print(result, {
  format: PrintFormat.YAML,
  writer: process.stdout
});
