import logger, { LogLevel } from "@kosko/log";
import { spawn } from "@kosko/exec-utils";
import whichPMRuns from "which-pm-runs";

export function getPackageManager(): string {
  const pm = whichPMRuns();
  if (!pm) return "npm";

  logger.log(
    LogLevel.Debug,
    `Detected package manager: ${pm.name} ${pm.version}`
  );
  return pm.name;
}

export async function installDependencies(
  pm: string,
  path: string
): Promise<void> {
  logger.log(LogLevel.Info, `Installing dependencies with ${pm}`);

  await spawn(pm, ["install"], {
    stdio: "inherit",
    cwd: path
  });
}
