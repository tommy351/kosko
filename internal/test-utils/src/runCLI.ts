import execa from "execa";

export async function runCLI(
  path: string,
  args: readonly string[],
  options: execa.Options = {}
): Promise<execa.ExecaReturnValue> {
  return execa(path, args, {
    ...options,
    env: {
      // Set locale to en_US to make sure the output is consistent
      LC_ALL: "en_US",
      // Always enable console colors to make sure the output is consistent
      FORCE_COLOR: "1",
      // Disable DeprecationWarning, because ajv-formats-draft2019 still uses
      // the deprecated `punycode` module.
      NODE_OPTIONS: "--no-deprecation",
      ...options.env
    }
  });
}
