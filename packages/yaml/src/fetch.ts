/* eslint-disable no-restricted-globals */
/// <reference lib="dom" />
import { createRequire } from "node:module";
import { BUILD_FORMAT, BUILD_TARGET } from "@kosko/build-scripts";

function getFetch(): typeof fetch {
  if (typeof fetch === "function") {
    return fetch;
  }

  if (BUILD_TARGET === "node") {
    const req =
      BUILD_FORMAT === "cjs" ? require : createRequire(import.meta.url);

    return req("node-fetch");
  }

  throw new Error("fetch is undefined");
}

export default getFetch();
