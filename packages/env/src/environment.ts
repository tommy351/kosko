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
 * Each layer is applied to the previous layer and can override
 * some of variables.
 */
export interface VariablesLayer {
  /**
   * Overrides variables for the specified component.
   * If component name is not specified then overrides only
   * global variables.
   */
  (target: Record<string, any>, componentName?: string): Record<string, any>;
}

export class Environment {
  private variableLayers: VariablesLayer[];

  public env?: string;
  public paths: Paths = {
    global: "environments/#{environment}",
    component: "environments/#{environment}/#{component}"
  };

  public constructor(public cwd: string) {
    const globalVariablesLayer: VariablesLayer = values =>
      merge(values, this.require(this.paths.global));

    const componentVariablesLayer: VariablesLayer = (values, componentName) =>
      merge(
        values,
        componentName ? this.require(this.paths.component, componentName) : {}
      );

    this.variableLayers = [globalVariablesLayer, componentVariablesLayer];
  }

  /**
   * Returns global variables.
   *
   * If env is not set or require failed, returns an empty object.
   */
  public global(): any {
    return this.variableLayers.reduce(
      (target, applyLayer) => applyLayer(target),
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
    return this.variableLayers.reduce(
      (target, applyLayer) => applyLayer(target, name),
      {}
    );
  }

  /**
   * Adds a new variables layer.
   *
   * Each layer can override variables of the previous layer.
   *
   * @param layer Variables layer
   */
  public addVariablesLayer(layer: VariablesLayer): void {
    this.variableLayers.push(layer);
  }

  /**
   * Removes the existing variables layer.
   *
   * @param layer Variables layer
   */
  public removeVariablesLayer(layer: VariablesLayer): void {
    this.variableLayers = this.variableLayers.filter(x => x !== layer);
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
