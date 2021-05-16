import { NotFoundError } from "./types";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function handleError(err: any): any {
  if (err.code === "ENOENT") {
    return new NotFoundError(err.message);
  }

  return err;
}
