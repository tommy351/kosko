import { requireDefault } from "@kosko/require";
import debug from "../debug";
import { merge } from "../merge";
import { reduce } from "../reduce";
import { BaseEnvironment } from "./base";

export class SyncEnvironment extends BaseEnvironment {
  protected execReducers(name?: string): any {
    return reduce(this.reducers, name);
  }

  protected mergeValues(values: any[]): any {
    return merge(values);
  }

  protected requireModule(id: string): any {
    try {
      return requireDefault(id);
    } catch (err) {
      if (err.code === "MODULE_NOT_FOUND") {
        debug("Cannot find module: %s", id);
        return {};
      }

      throw err;
    }
  }
}
