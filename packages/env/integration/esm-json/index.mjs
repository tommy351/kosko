import env from "@kosko/env";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

env.cwd = join(fileURLToPath(import.meta.url), "..");
env.env = "dev";

console.log(await env.global());
