import { expose } from "comlink";
import { PlaygroundWorker } from "./types";
import { bundle } from "./rollup";

const worker: PlaygroundWorker = {
  bundle
};

expose(worker, self);
