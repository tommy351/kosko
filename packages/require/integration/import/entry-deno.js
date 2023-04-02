/* global Deno */
/* eslint-disable node/no-missing-import */

import { resolve } from "node:path";
import { importPath } from "../../dist/index.deno.mjs";

const path = resolve(Deno.cwd(), Deno.env.get("IMPORT_PATH"));

await Deno.stdout.write(
  new TextEncoder().encode(JSON.stringify(await importPath(path)))
);
