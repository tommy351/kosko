import logger, { LogLevel } from "@kosko/log";
import { spawn } from "@kosko/exec-utils";
import { access } from "node:fs/promises";
import { join } from "node:path";
import pc from "picocolors";
import { env } from "node:process";

async function fileExists(path: string) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function detectPackageManager(cwd: string): Promise<string> {
  const [isYarn, isPnpm] = await Promise.all(
    ["yarn.lock", "pnpm-lock.yaml"].map((name) => fileExists(join(cwd, name)))
  );

  if (isYarn) return "yarn";
  if (isPnpm) return "pnpm";
  return "npm";
}

export function getInstallCommand({
  packageManager,
  dependencies,
  dev
}: {
  packageManager: string;
  dependencies: string[];
  dev?: boolean;
}) {
  const isYarn = packageManager === "yarn";

  return [
    packageManager,
    isYarn ? "add" : "install",
    ...dependencies,
    ...(dev ? [isYarn ? "--dev" : "--save-dev"] : [])
  ];
}

export async function installDependencies({
  cwd,
  dependencies,
  packageManager,
  dev
}: {
  cwd: string;
  dependencies: string[];
  packageManager: string;
  dev?: boolean;
}): Promise<void> {
  logger.log(
    LogLevel.Info,
    `Installing ${dev ? "dev " : ""}dependencies: ${dependencies
      .map((x) => pc.cyan(x))
      .join(", ")}`
  );

  const [name, ...args] = getInstallCommand({
    dependencies,
    packageManager,
    dev
  });

  await spawn(name, args, {
    stdio: "inherit",
    cwd,
    env: {
      ...env,
      ADBLOCK: "1",
      DISABLE_OPENCOLLECTIVE: "1"
    }
  });
}
