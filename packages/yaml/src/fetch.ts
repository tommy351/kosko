/* eslint-disable no-restricted-globals */
/// <reference lib="dom" />
import { createRequire } from "node:module";

function getFetch(): typeof fetch {
  if (typeof fetch === "function") {
    return fetch;
  }

  if (process.env.BUILD_TARGET === "node") {
    const req =
      process.env.BUILD_FORMAT === "cjs"
        ? require
        : createRequire(import.meta.url);

    return req("node-fetch");
  }

  throw new Error("fetch is undefined");
}

export default getFetch();
