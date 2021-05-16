import { setDefaultFormat } from "./deno_dist/migrate.ts";
import { MigrateFormat } from "./deno_dist/types.ts";

setDefaultFormat(MigrateFormat.ESM);

export * from "./deno_dist/index.ts";
