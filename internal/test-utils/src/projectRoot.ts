import { join } from "node:path";
import { fileURLToPath } from "node:url";

export const projectRoot = join(fileURLToPath(import.meta.url), "../../../..");
