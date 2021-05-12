import "https://cdn.skypack.dev/mocha@8.4.0?dts";
import chai from "https://cdn.skypack.dev/chai@4.3.4?dts";
import chaiAsPromised from "https://cdn.skypack.dev/chai-as-promised@7.1.1";

export * as path from "https://deno.land/std@0.96.0/path/mod.ts";

mocha.setup({ ui: "bdd", reporter: "spec" });
chai.should();
chai.use(chaiAsPromised);

export const expect = chai.expect;
