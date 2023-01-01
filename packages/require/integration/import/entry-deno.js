/* global Deno */
/* eslint-disable node/no-missing-import */

import { resolve } from "https://deno.land/std@0.167.0/path/mod.ts";
import { importPath } from "npm:@kosko/require";

const path = resolve(Deno.cwd(), Deno.env.get("IMPORT_PATH"));

await Deno.stdout.write(
  new TextEncoder().encode(JSON.stringify(await importPath(path)))
);
