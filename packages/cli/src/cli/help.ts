import groupBy from "lodash.groupby";
import { Writable } from "stream";
import { Option, OptionType, CommandMeta } from "./types";

interface Entry {
  key: string;
  description: string;
}

interface OptionWithName extends Option {
  name: string;
}

function getOptionKey(opt: OptionWithName) {
  let key = [opt.name]
    .concat(opt.alias || [])
    .map(x => (x.length > 1 ? `--${x}` : `-${x}`))
    .sort((a, b) => a.length - b.length)
    .join(", ");

  switch (opt.type) {
    case OptionType.Boolean:
    case OptionType.Count:
      break;

    default:
      if (opt.type) key += ` ${opt.type}`;
  }

  return key;
}

class Help {
  private readonly cmd: CommandMeta;
  private readonly writer: Writable;

  private started = false;

  constructor(cmd: CommandMeta, writer: Writable) {
    this.cmd = cmd;
    this.writer = writer;
  }

  public async print() {
    await this.printUsage();
    await this.printDescription();
    await this.printArgs();
    await this.printCommands();
    await this.printOptions();
  }

  private write(chunk: any) {
    return new Promise((resolve, reject) => {
      this.writer.write(chunk, err => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  private async printUsage() {
    const { usage } = this.cmd;
    if (!usage) return;

    await this.printHeader("Usage: " + usage);
  }

  private async printDescription() {
    const { description } = this.cmd;
    if (!description) return;

    await this.printHeader(description);
  }

  private async printArgs() {
    const { args = [] } = this.cmd;

    await this.printEntries(
      "Arguments:",
      args.map(arg => ({ key: arg.name, description: arg.description || "" }))
    );
  }

  private async printCommands() {
    const { commands = {} } = this.cmd;
    const entries: Entry[] = [];

    for (const key of Object.keys(commands)) {
      entries.push({ key, description: commands[key].description || "" });
    }

    await this.printEntries("Commands:", entries);
  }

  private async printOptions() {
    const { options = {} } = this.cmd;
    const opts: OptionWithName[] = [];

    for (const key of Object.keys(options)) {
      opts.push({ ...options[key], name: key });
    }

    const groups = groupBy(opts, opt => opt.group || "Options");

    for (const key of Object.keys(groups)) {
      await this.printOptionGroup(key, groups[key]);
    }
  }

  private async printOptionGroup(group: string, options: OptionWithName[]) {
    await this.printEntries(
      `${group}:`,
      options.map(opt => ({
        key: getOptionKey(opt),
        description: opt.description || ""
      }))
    );
  }

  private async printHeader(header?: string) {
    if (this.started) await this.write("\n");
    await this.write(header + "\n");
    this.started = true;
  }

  private async printEntries(header: string, entries: Entry[]) {
    if (!entries.length) return;

    await this.printHeader(header);

    const keySize = Math.max(...entries.map(e => e.key.length));

    entries.sort((a, b) => {
      if (a.key > b.key) return 1;
      if (a.key < b.key) return -1;
      return 0;
    });

    for (const entry of entries) {
      const pad = Array(keySize - entry.key.length)
        .fill(" ")
        .join("");

      await this.write(`  ${entry.key}${pad}  ${entry.description}\n`);
    }
  }
}

export async function help<T = any>(
  cmd: CommandMeta<T>,
  writer: Writable = process.stdout
) {
  const helper = new Help(cmd, writer);
  return helper.print();
}
