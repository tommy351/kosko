import { Signale } from "signale";

export const logger = new Signale({
  stream: process.stderr
});
