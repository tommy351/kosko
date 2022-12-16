import env from "../../dist/index.node.mjs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

env.cwd = join(fileURLToPath(import.meta.url), "..");
env.env = process.env.ENV_NAME;

console.log(await env.global());
