import _resolve from "resolve";
import { promisify } from "util";

type Resolve = (id: string, opts?: _resolve.AsyncOpts) => Promise<string>;

/**
 * Resolves path to the specified module.
 * See [resolve](https://www.npmjs.com/package/resolve) for more info.
 */
export const resolve = (promisify(_resolve) as any) as Resolve;
