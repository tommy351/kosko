import { object, optional } from "superstruct";
import {
  compileNamespacedNamePattern,
  isService,
  namespacedNameArraySchema
} from "../utils/manifest";
import { createRule } from "./types";
import { matchAny } from "../utils/pattern";

export default createRule({
  config: object({
    allow: optional(namespacedNameArraySchema)
  }),
  factory(ctx) {
    const isAllowed = matchAny(
      (ctx.config?.allow ?? []).map(compileNamespacedNamePattern)
    );

    return {
      validate(manifest) {
        if (!isService(manifest)) return;

        if (manifest.metadata && isAllowed(manifest.metadata)) {
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
