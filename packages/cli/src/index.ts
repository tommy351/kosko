import { Main } from "@oclif/command";

class MainCommand extends Main {
  protected _helpOverride() {
    const [id, ...argv] = this.argv;
    const c = this.config.findCommand(id);

    if (c) {
      const command = c.load() as any;

      // Override from subcommand
      if (typeof command.helpOverride === "function") {
        return command.helpOverride(argv);
      }
    }

    return super._helpOverride();
  }
}

export async function run(argv: string[] = process.argv.slice(2)) {
  return MainCommand.run(argv);
}
