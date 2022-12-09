import { env } from "node:process";
import { loadUrl } from "@kosko/yaml";

const result = await loadUrl(`http://${env.SERVER_ADDRESS}`)();

console.log(result);
