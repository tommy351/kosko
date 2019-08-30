import { join } from "path";
import { requireDefault } from "@kosko/require";
import Debug from "debug";
import { merge } from "./merge";

const debug = Debug("kosko:env");
const rTemplate = /#\{(\w+)\}/g;

function tryRequire(id: string): any {
  try {
    return requireDefault(id);
  } catch (err) {
    if (err.code === "MODULE_NOT_FOUND") {
      debug("Module not found:", id);
      return {};
    }

    throw err;
  }
}

export interface Paths {
  global: string;
  component: string;
}

export class Environment {
  public env?: string;
  public paths: Paths = {
    global: "environments/#{environment}",
    component: "environments/#{environment}/#{component}"
  };

  public constructor(public cwd: string) {}

  /**
   * Returns global variables.
   *
   * If env is not set or require failed, returns an empty object.
   */
  public global(): any {
    return this.require(this.paths.global);
  }

  /**
   * Returns component variables merged with global variables.
   *
   * If env is not set or require failed, returns an empty object.
   *
   * @param name Component name
   */
  public component(name: string): any {
    return merge(this.global(), this.require(this.paths.component, name));
  }

  private require(template: string, component?: string): any {
    if (!this.env) return {};

    const data: any = {
      environment: this.env,
      component
    };

    const path = template.replace(rTemplate, (s, key) => {
      return data[key];
    });

    return tryRequire(join(this.cwd, path));
  }
}
