import { createRequire } from "node:module";

const req =
  // eslint-disable-next-line no-restricted-globals
  process.env.BUILD_FORMAT === "cjs" ? require : createRequire(import.meta.url);

export default global.fetch ?? req("node-fetch");
