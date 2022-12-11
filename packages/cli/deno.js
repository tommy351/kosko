import { run, handleError } from "./dist/index.deno.mjs";

run().catch(handleError);
