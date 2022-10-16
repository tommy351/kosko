import exit from "exit";
import { isAbsolute, resolve } from "node:path";
import logger, { LogLevel } from "@kosko/log";
import yargs from "yargs";
import { Template } from "./template";
import { writeFiles } from "./write";

/**
 * Parse command line arguments and generate files with a template.
 *
 * @param template - Template
 * @param argv - Command line arguments
 * @public
 */
export async function run(
  template: Template<any>,
  argv: string[] = process.argv.slice(2)
): Promise<void> {
  const cmd = yargs.option("cwd", {
    type: "string",
    describe: "Path of working directory",
    default: process.cwd(),
    defaultDescription: "CWD",
    coerce(arg: string): string {
      return isAbsolute(arg) ? arg : resolve(arg);
    }
  });

  const { description, options = {} } = template;

  if (description) {
    cmd.usage(description);
  }

  for (const key of Object.keys(options)) {
    cmd.option(key, options[key]);
  }

  try {
    const args = await cmd.parse(argv);
    const result = await template.generate(args);

    await writeFiles(args.cwd, result.files);
    logger.log(LogLevel.Info, `${result.files.length} files are generated`);
  } catch (err) {
    console.error(err);
    exit(1);
    throw err;
  }
}
