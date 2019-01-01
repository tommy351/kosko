import _resolve from "resolve";
import { promisify } from "util";

type Resolve = (id: string, opts?: _resolve.AsyncOpts) => Promise<string>;
export const resolve = (promisify(_resolve) as any) as Resolve;
