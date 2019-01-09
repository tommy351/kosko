import { join } from "path";
import { requireDefault } from "@kosko/require";

function tryRequire(id: string) {
  try {
    return requireDefault(id);
  } catch {
    return {};
  }
}

export class Environment {
  public env: string | undefined;

  constructor(public cwd: string = process.cwd()) {}

  /**
   * Returns global variables.
   *
   * If env is not set or require failed, returns an empty object.
   */
  public global() {
    const envDir = this.getEnvDir();
    if (!envDir) return {};
    return tryRequire(envDir);
  }

  /**
   * Returns component variables merge with global variables.
   *
   * If env is not set or require failed, returns an empty object.
   *
   * @param name Component name
   */
  public component(name: string) {
    const envDir = this.getEnvDir();
    if (!envDir) return {};

    return {
      ...this.global(),
      ...tryRequire(join(envDir, name))
    };
  }

  private getEnvDir() {
    return this.env && join(this.cwd, "environments", this.env);
  }
}
