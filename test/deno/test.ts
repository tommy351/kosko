import "./deps.ts";

// config
import "../../packages/config/test/deno/config.ts";

// env
import "../../packages/env/test/deno/environment.ts";

// generate
import "../../packages/generate/test/deno/generate.ts";

// yaml
import "../../packages/yaml/test/deno/load.ts";

mocha.run((failures) => {
  Deno.exit(failures ? 1 : 0);
});
