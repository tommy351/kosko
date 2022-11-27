import exit from "exit";
import { isAbsolute, resolve } from "node:path";
import logger, { LogLevel } from "@kosko/log";
import yargs from "yargs";
import { Template } from "./template";
import { writeFiles } from "./write";
import { argv, cwd } from "node:process";

/**
 * Parses command line arguments and generates files with a {@link Template}.
 *
 * @remarks
 *
 * When an error occurred, it prints error to logger and terminates current
 * process.
 *
 * @param template - Template
 * @param args - Command line arguments
 * @public
 */
export async function run(
  template: Template<any>,
  args: readonly string[] = argv.slice(2)
): Promise<void> {
  const cmd = yargs.option("cwd", {
    type: "string",
    describe: "Path of working directory",
    default: cwd(),
    defaultDescription: "CWD",
    coerce(arg): string {
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
    const options = await cmd.parse(args);
    const result = await template.generate(options);

    await writeFiles(options.cwd, result.files);
    logger.log(LogLevel.Info, `${result.files.length} files are generated`);
  } catch (err) {
    logger.log(LogLevel.Error, "Generate failed", { error: err });
    exit(1);
    throw err;
  }
}
