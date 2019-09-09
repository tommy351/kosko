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

/**
 * Describes a step in the variables overriding chain.
 */
export interface Reducer {
  /**
   * Name of the reducer.
   */
  name: string;

  /**
   * Overrides variables for the specified component.
   * If component name is not specified then overrides only
   * global variables.
   */
  reduce(
    target: Record<string, any>,
    componentName?: string
  ): Record<string, any>;
}

export class Environment {
  private reducers: Reducer[] = [];

  public env?: string;
  public paths: Paths = {
    global: "environments/#{environment}",
    component: "environments/#{environment}/#{component}"
  };

  public constructor(public cwd: string) {
    this.resetReducers();
  }

  /**
   * Returns global variables.
   *
   * If env is not set or require failed, returns an empty object.
   */
  public global(): any {
    return this.reducers.reduce(
      (target, reducer) => reducer.reduce(target),
      {}
    );
  }

  /**
   * Returns component variables merged with global variables.
   *
   * If env is not set or require failed, returns an empty object.
   *
   * @param name Component name
   */
  public component(name: string): any {
    return this.reducers.reduce(
      (target, reducer) => reducer.reduce(target, name),
      {}
    );
  }

  /**
   * Sets list of reducers using the specified callback function.
   */
  public setReducers(callbackfn: (reducers: Reducer[]) => Reducer[]): void {
    this.reducers = callbackfn([...this.reducers]);
  }

  /**
   * Resets reducers to the defaults.
   */
  public resetReducers(): void {
    this.setReducers(() => [
      this.createGlobalReducer(),
      this.createComponentReducer()
    ]);
  }

  private createGlobalReducer(): Reducer {
    const reducer: Reducer = {
      name: "global",
      reduce: values => merge(values, this.require(this.paths.global))
    };

    return reducer;
  }

  private createComponentReducer(): Reducer {
    const reducer: Reducer = {
      name: "component",
      reduce: (values, componentName) => {
        if (componentName) {
          return merge(
            values,
            this.require(this.paths.component, componentName)
          );
        }

        return values;
      }
    };
    
    return reducer;
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
