import "./deps.ts";

// config
import "../../packages/config/test/deno/config.ts";

// generate
import "../../packages/generate/test/deno/generate.ts";

mocha.run((failures) => {
  Deno.exit(failures ? 1 : 0);
});
