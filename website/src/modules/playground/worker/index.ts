// import { wrap } from "comlink";
import type { PlaygroundWorker } from "./types";

export function createPlaygroundWorker(): PlaygroundWorker {
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
export { execute } from "./execute";
