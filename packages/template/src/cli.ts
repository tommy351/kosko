import exit from "exit";
import { isAbsolute, resolve } from "path";
import yargs from "yargs";
import { Template } from "./template";
import { writeFiles } from "./write";

export async function run(
  template: Template<any>,
  argv: string[] = process.argv.slice(2)
) {
  const cmd = yargs.option("cwd", {
    type: "string",
    describe: "Path of working directory",
    default: process.cwd(),
    defaultDescription: "CWD",
    coerce(arg) {
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
    const args = cmd.parse(argv);
    const result = await template.generate(args);

    await writeFiles(args.cwd, result.files);
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.error(err);
    exit(1);
    throw err;
  }
}
