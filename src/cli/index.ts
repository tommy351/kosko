import yargs from "yargs";
import { globalOptions } from "./base";
import { generateCommand } from "./generate";
import { initCommand } from "./init";
import { newCommand } from "./new";

export async function run(argv: string[] = process.argv.slice(2)) {
  yargs
    .scriptName("kosko")
    .options(globalOptions)
    .command(initCommand)
    .command(generateCommand)
    .command(newCommand)
    .demandCommand()
    .help()
    .parse(argv);
}
