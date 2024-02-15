// eslint-disable-next-line node/no-missing-import
import { Argv, CommandModule } from "yargs";

/**
 * @public
 */
export interface RootArguments {
  cwd: string;
  "log-level": string;
  silent: boolean;
}

/**
 * @public
 */
export type Command<T> = CommandModule<RootArguments, T>;

/**
 * @public
 */
export function parse(input: Argv, argv: readonly string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    input.parse(argv, {}, (err, args, output) => {
      if (output) {
        console.error(output);
      }

      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
}
