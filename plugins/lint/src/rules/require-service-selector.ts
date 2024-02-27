import { object, optional } from "superstruct";
import {
  containNamespacedName,
  isService,
  namespacedNameArraySchema
} from "../utils/manifest";
import { createRule } from "./types";

export default createRule({
  config: object({
    allow: optional(namespacedNameArraySchema)
  }),
  factory(ctx) {
    const allow = ctx.config?.allow ?? [];

    return {
      validate(manifest) {
        if (!isService(manifest)) return;

        if (
          manifest.metadata &&
          containNamespacedName(allow, manifest.metadata)
        ) {
          return;
        }

        const selector = manifest.data.spec?.selector;

        if (!selector || Object.keys(selector).length === 0) {
          ctx.report(manifest, "Service selector must not be empty");
        }
      }
    };
  }
});
