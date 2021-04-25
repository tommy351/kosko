import { wrap } from "comlink";
import { PlaygroundWorker } from "./types";

export function createPlaygroundWorker(): PlaygroundWorker {
  const worker = new Worker(new URL("./worker.ts", import.meta.url));
  return wrap<PlaygroundWorker>(worker);
}

export * from "./types";
export { execute } from "./execute";
