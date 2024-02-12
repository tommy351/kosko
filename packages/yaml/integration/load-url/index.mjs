import { env } from "node:process";
import { loadUrl } from "@kosko/yaml";
import { Console } from "node:console";

const logger = new Console({
  stdout: process.stdout,
  stderr: process.stderr,
  colorMode: false
});

const result = await loadUrl(`http://${env.SERVER_ADDRESS}`)();

logger.log(result);
