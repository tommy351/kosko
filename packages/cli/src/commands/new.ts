import { RootCommand, RootFlags } from "../root";
import { Template, Option } from "@kosko/template";
import { parse } from "@oclif/parser";
import { Command, flags } from "@oclif/command";

export interface NewArgs {
  template: string;
}

export default class NewCommand extends RootCommand<RootFlags, NewArgs> {
  public static description = "create files based on templates";
  public static strict = false;

  public static flags = { ...RootCommand.flags };

  public static args = [
    {
      name: "template",
      description: "template to apply",
      required: true
    }
  ];

  public static helpOverride(argv: string[]): boolean {
    const { args } = parse(argv, {
      strict: false,
      flags: {
        help: flags.boolean()
      },
      args: [{ name: "template" }]
    });

    return !args.template;
  }

  public async run() {
    const path = require.resolve(this.args.template, { paths: [this.cwd] });
    this.debug("template path", path);

    const template: Template<any> = require(path);
    const cmd = buildTemplateCommand(this.args.template, template);

    return cmd.run(this.argv.filter(x => x !== this.args.template));
  }

  protected _helpOverride(): boolean {
    if (this.args.template) return false;
    return super._helpOverride();
  }
}

function buildTemplateCommand(
  id: string,
  template: Template<any>
): typeof Command {
  const cmdFlags: any = { ...NewCommand.flags };

  if (template.options) {
    for (const key of Object.keys(template.options)) {
      cmdFlags[key] = buildFlag(template.options[key]);
    }
  }

  // tslint:disable-next-line:max-classes-per-file
  return class extends RootCommand {
    public static id = `new ${id}`;
    public static flags = cmdFlags;
    public static strict = false;
    public static description = template.description;

    public async run() {
      await template.generate(this.flags);
    }
  };
}

function buildFlag(option: Option<any>) {
  const flag = {
    parse: (i: string) => i,
    type: "option",
    ...option
  };

  switch (option.type) {
    case "boolean":
      flag.type = "boolean";
      break;

    case "number":
      flag.parse = Number;
      break;
  }

  return flag;
}
