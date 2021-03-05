import { requireDefault } from "@kosko/require";
import debug from "../debug";
import { mergeAsync } from "../merge";
import { reduceAsync } from "../reduce";
import { BaseEnvironment } from "./base";

export class AsyncEnvironment extends BaseEnvironment {
  protected execReducers(name?: string): any {
    return reduceAsync(this.reducers, name);
  }

  protected mergeValues(values: any[]): any {
    return mergeAsync(values);
  }

  protected async requireModule(id: string): Promise<any> {
    try {
      await requireDefault(id);
    } catch (err) {
      if (err.code === "ERR_MODULE_NOT_FOUND") {
        debug("Module not found:", id);
        return {};
      }

      throw err;
    }
  }
}
