import resolve from "resolve";
import { promisify } from "util";

type Resolve = (id: string, opts?: resolve.AsyncOpts) => Promise<string>;

const resolveAsync = (promisify(resolve) as any) as Resolve;

export default resolveAsync;
