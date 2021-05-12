import "./deps.ts";

import "../../packages/config/test/deno/config.ts";

mocha.run((failures) => {
  Deno.exit(failures ? 1 : 0);
});
