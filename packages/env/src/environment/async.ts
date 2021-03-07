import debug from "../debug";
import { importPath, resolveESM } from "@kosko/require";
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
    // Resolve path before importing ESM modules because file extensions are
    // mandatory for `import()`. Import paths used in `require()` must be
    // resolved as below.
    //
    // - Directory: `./dir` -> `./dir/index.js`
    // - File: `./file` -> `./file.js`
    //
    // https://nodejs.org/api/esm.html#esm_mandatory_file_extensions
    const path = await resolveESM(id, {
      extensions: this.extensions.map((ext) => `.${ext}`)
    });

    if (!path) {
      debug("Module not found: %s", id);
      return {};
    }

    try {
      debug("Importing %s", path);
      const mod = await importPath(path);
      return mod.default;
    } catch (err) {
      if (err.code === "ERR_MODULE_NOT_FOUND") {
        debug("Module not found: %s", path);
        return {};
      }

      throw err;
    }
  }
}
