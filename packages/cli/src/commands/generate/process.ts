import { stdout, stderr } from "node:process";
import { Writable } from "node:stream";

export function getStdout(): Writable {
  return stdout;
}

export function getStderr(): Writable {
  return stderr;
}
