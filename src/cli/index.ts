import yargs from "yargs";
import { initCommand } from "./init";
import { generateCommand } from "./generate";
import { logger, initLogger } from "../utils/log";

export async function run(argv: string[] = process.argv.slice(2)) {
  yargs
    .scriptName("kosko")
    .fail((msg, err) => {
      yargs.showHelp();
      logger.error(msg || "", err || "");
      process.exit(1);
    })
    .option("verbose", {
      type: "boolean",
      describe: "Show more logs"
    })
    .middleware(initLogger)
    .command(initCommand)
    .command(generateCommand)
    .demandCommand()
    .help()
    .parse(argv);
}
