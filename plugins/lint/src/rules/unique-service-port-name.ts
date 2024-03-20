import { isService } from "../utils/manifest";
import { createRule } from "./types";

export default createRule({
  factory(ctx) {
    return {
      validate(manifest) {
        if (!isService(manifest)) return;

        const portNames = new Set<string>();

        for (const port of manifest.data.spec?.ports ?? []) {
          if (!port.name) continue;

          if (portNames.has(port.name)) {
            ctx.report(
              manifest,
              `Service contains multiple ports with the same name "${port.name}"`
            );
          } else {
            portNames.add(port.name);
          }
        }
      }
    };
  }
});
