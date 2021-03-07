import { getRequireExtensions } from "@kosko/require";
import { join } from "path";
import { formatPath, Paths } from "../paths";
import { Reducer } from "../reduce";

export abstract class BaseEnvironment {
  protected reducers: Reducer[] = [];

  /**
   * Current environment.
   */
  public env?: string | string[];

  /**
   * Paths of environment files.
   */
  public paths: Paths = {
    global: "environments/#{environment}",
    component: "environments/#{environment}/#{component}"
  };

  /**
   * File extensions of environments.
   */
  public extensions: string[] = getRequireExtensions().map((ext) =>
    ext.substring(1)
  );

  public constructor(public cwd: string) {
    this.resetReducers();
  }

  protected abstract execReducers(name?: string): any;
  protected abstract mergeValues(values: any[]): any;
  protected abstract requireModule(id: string): any;

  /**
   * Returns global variables.
   *
   * If env is not set or require failed, returns an empty object.
   */
  public global(): any {
    return this.execReducers();
  }

  /**
   * Returns component variables merged with global variables.
   *
   * If env is not set or require failed, returns an empty object.
   *
   * @param name Component name
   */
  public component(name: string): any {
    return this.execReducers(name);
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
      reduce: (values) =>
        this.mergeValues([values, ...this.requireAllEnvs(this.paths.global)])
    };

    return reducer;
  }

  private createComponentReducer(): Reducer {
    const reducer: Reducer = {
      name: "component",
      reduce: (values, componentName) => {
        if (!componentName) return values;

        return this.mergeValues([
          values,
          ...this.requireAllEnvs(this.paths.component, componentName)
        ]);
      }
    };

    return reducer;
  }

  private requireAllEnvs(template: string, component?: string): any[] {
    if (!this.env) return [];

    const envs = Array.isArray(this.env) ? this.env : [this.env];

    return envs.map((env) => {
      const path = formatPath(template, {
        environment: env,
        ...(component && { component })
      });

      return this.requireModule(join(this.cwd, path));
    });
  }
}
