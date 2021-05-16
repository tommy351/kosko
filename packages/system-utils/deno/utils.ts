import { NotFoundError } from "../deno_dist/types.ts";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function handleError(err: any): any {
  if (err instanceof Deno.errors.NotFound) {
    return new NotFoundError(err.message);
  }

  return err;
}
