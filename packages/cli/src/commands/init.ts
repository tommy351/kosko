import { flags } from "@oclif/command";
import { join } from "path";
import { RootCommand, RootFlags } from "../root";
import { makeExamples } from "../example";
import writePkg from "write-pkg";
import makeDir from "make-dir";
import fs from "fs";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);

export interface InitFlags extends RootFlags {
  force?: boolean;
}

export interface InitArgs {
  path?: string;
}

export default class InitCommand extends RootCommand<InitFlags, InitArgs> {
  public static description = "initialize data for kosko";

  public static flags = {
    ...RootCommand.flags,
    force: flags.boolean({
      char: "f",
      description: "overwrite existing files"
    })
  };

  public static args = [
    {
      name: "path",
      description: "path to initialize, default to the current directory"
    }
  ];

  public static examples = makeExamples([
    { description: "Initialize in the current directory", command: "init" },
    {
      description: "Initialize in the specified folder",
      command: "init ./folder"
    }
  ]);

  public async run() {
    const path = this.args.path ? join(this.cwd, this.args.path) : this.cwd;
    this.log("Initialize in path:", path);

    const exist = await exists(path);

    if (exist && !this.flags.force) {
      this.error("Already exists. Use --force to overwrite existing files.");
      return;
    }

    const componentDir = join(path, "components");
    const envDir = join(path, "environments");
    const templateDir = join(path, "templates");

    for (const dir of [componentDir, envDir, templateDir]) {
      this.debug("creating directory", dir);
      await makeDir(dir);
    }

    this.debug("writing env index");

    await writeFile(
      join(envDir, "index.js"),
      'module.exports = require("./" + kosko.env);'
    );

    this.debug("updating package.json");

    await writePkg(join(path, "package.json"), {
      dependencies: {
        "kubernetes-models": "^0.2.1",
        "require-dir": "^1.2.0"
      }
    });

    this.log("Everything is set up.");
  }
}

function exists(path: string) {
  return new Promise(resolve => fs.exists(path, resolve));
}
