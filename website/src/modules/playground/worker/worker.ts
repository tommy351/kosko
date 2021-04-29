import { expose } from "comlink";
import { Bundler } from "./types";
import { bundle } from "./rollup";

const worker: Bundler = {
  bundle
};

expose(worker, self);
