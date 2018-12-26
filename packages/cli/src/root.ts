import { Command, flags } from "@oclif/command";
import { Output } from "@oclif/parser";
import { format } from "util";
import { resolve } from "path";

export interface RootFlags {
  cwd: string;
}

export abstract class RootCommand<
  Flags extends RootFlags = RootFlags,
  Args = { [key: string]: any }
> extends Command {
  public static flags = {
    cwd: flags.string({
      description: "current working directory"
    })
  };

  protected parserOutput!: Output<Flags, Args>;

  public async init() {
    this.parserOutput = this.parse<Flags, Args>(this.ctor);
    return super.init();
  }

  public log(message?: string, ...args: any[]) {
    // Print log to stderr
    process.stderr.write(format(message, ...args) + "\n");
  }

  protected get flags(): Flags {
    return this.parserOutput.flags;
  }

  protected get args(): Args {
    return this.parserOutput.args;
  }

  protected get cwd(): string {
    return this.flags.cwd ? resolve(this.flags.cwd) : process.cwd();
  }
}
