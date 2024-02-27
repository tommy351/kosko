import { boolean, object, optional } from "superstruct";
import { createRule } from "./types";
import { isService } from "../utils/manifest";

export default createRule({
  config: object({
    always: optional(boolean())
  }),
  factory(ctx) {
    const always = ctx.config?.always ?? false;

    return {
      validate(manifest) {
        if (!isService(manifest) || !manifest.data.spec?.ports?.length) {
          return;
        }

        const ports = manifest.data.spec.ports;

        if (ports.length === 1 && !always) return;

        for (const port of ports) {
          if (!port.name) {
            ctx.report(manifest, `Port ${port.port} must have a name.`);
          }
        }
      }
    };
  }
});
