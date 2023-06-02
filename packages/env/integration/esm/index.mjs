import env from "../../dist/index.node.mjs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

env.cwd = join(fileURLToPath(import.meta.url), "..");
env.env = process.env.ENV_NAME;
env.extensions = [...env.extensions, "ts"];

console.log(await env.global());
