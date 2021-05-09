import yargs from "yargs";
import globby from "globby";
import { build } from "./build";

const { argv } = yargs.option("cwd", {
  type: "string",
  description: "Current working directory",
  default: process.cwd(),
  defaultDescription: "CWD"
});

(async () => {
  const paths = argv._.map((x) => `${x}`);
  const tsConfigs = await globby(paths, {
    cwd: argv.cwd,
    absolute: true
  });

  for (const conf of tsConfigs) {
    await build(conf);
  }
})();
