import { generate, print, PrintFormat } from "../../dist/index.node.mjs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const result = await generate({
  path: join(fileURLToPath(import.meta.url), "../components"),
  components: ["*"]
});

print(result, {
  format: PrintFormat.YAML,
  writer: process.stdout
});
