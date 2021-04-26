// import { wrap } from "comlink";
import type { Bundler } from "./types";

export function createBundler(): Bundler {
  // FIXME: Currently the worker build failed on production.
  // const worker = new Worker(new URL("./worker", import.meta.url));
  // return wrap<PlaygroundWorker>(worker);

  return {
    async bundle(options) {
      const { bundle } = await import("./rollup");
      return bundle(options);
    }
  };
}

export * from "./types";
