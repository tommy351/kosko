import { resolve } from "node:path";
import { cwd } from "node:process";
import { importPath } from "../../dist/index.node.mjs";

const path = resolve(cwd(), process.env.IMPORT_PATH);

process.stdout.write(JSON.stringify(await importPath(path)));
