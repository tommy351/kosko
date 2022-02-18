import logger, { LogLevel } from "@kosko/log";
import { spawn } from "@kosko/exec-utils";

export async function installDependencies(path: string): Promise<void> {
  logger.log(LogLevel.Info, "Installing dependencies");

  await spawn("npm", ["install"], {
    stdio: "inherit",
    cwd: path
  });
}
