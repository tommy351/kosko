import { getRequireExtensions } from "../../dist/index.node.mjs";

process.stdout.write(JSON.stringify(getRequireExtensions()));
