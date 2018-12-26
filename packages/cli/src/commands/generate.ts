import { flags } from "@oclif/command";
import { RootCommand, RootFlags } from "../root";
import { generate, print, PrintFormat } from "@kosko/generate";
import { makeExamples } from "../example";

export interface GenerateFlags extends RootFlags {
  env: string;
  output: PrintFormat;
  require?: string[];
}

export default class GenerateCommand extends RootCommand<GenerateFlags> {
  public static description = "generate Kubernetes resources";
  public static strict = false;

  public static flags = {
    ...RootCommand.flags,
    env: flags.string({
      char: "e",
      description: "environment",
      required: true
    }),
    output: flags.string({
      char: "o",
      description: "output format",
      options: Object.values(PrintFormat),
      default: PrintFormat.YAML
    }),
    require: flags.string({
      char: "r",
      description: "require modules",
      multiple: true
    })
  };

  public static args = [
    {
      name: "components",
      description: "components to generate"
    }
  ];

  public static examples = makeExamples([
    { description: "Generate all components", command: "generate --env dev" },
    {
      description: "Specify components by their name",
      command: "generate --env dev foo bar"
    },
    {
      description: "You can also use glob syntax here",
      command: "generate --env dev server_*"
    },
    {
      description: "Require ts-node to use TypeScript",
      command: "generate --env dev --require ts-node/register"
    }
  ]);

  public async run() {
    // Require external modules
    if (this.flags.require) {
      for (const id of this.flags.require) {
        this.debug("require external module", id);
        require(id);
      }
    }

    // Set global env
    global.kosko = {
      env: this.flags.env
    };
    this.debug("set global env as", this.flags.env);

    // Read components from raw parser output to support multiple arguments
    const components = this.parserOutput.argv;

    // Generate resources
    const result = await generate({
      path: this.cwd,
      components: components.length ? components : ["*"]
    });

    print(result, {
      format: this.flags.output,
      writer: process.stdout
    });
  }
}
