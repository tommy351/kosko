import env from "../../dist/index.node.mjs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { Console } from "node:console";

const logger = new Console({
  stdout: process.stdout,
  stderr: process.stderr,
  colorMode: false
});

env.cwd = join(fileURLToPath(import.meta.url), "..");
env.env = process.env.ENV_NAME;
env.extensions = [...env.extensions, "ts"];

logger.log(await env.global());
