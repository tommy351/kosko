import { array, object, optional, string } from "superstruct";
import { createRule } from "./types";
import { isService } from "../utils/manifest";

export default createRule({
  config: object({
    types: optional(array(string()))
  }),
  factory(ctx) {
    const types = new Set(ctx.config?.types ?? []);

    return {
      validate(manifest) {
        if (!isService(manifest)) return;

        const type = manifest.data.spec?.type;

        if (type && types.has(type)) {
          ctx.report(manifest, `Service type "${type}" is banned.`);
        }
      }
    };
  }
});
