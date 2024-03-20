import { object, optional } from "superstruct";
import { createRule } from "./types";
import { matchAny } from "../utils/pattern";
import {
  type NamespacedName,
  buildMissingResourceMessage,
  compileNamespacedNamePattern,
  namespacedNameArraySchema,
  isGatewayRoute,
  GATEWAY_GROUP
} from "../utils/manifest";

const GATEWAY_KIND = "Gateway";

export default createRule({
  config: object({
    allow: optional(namespacedNameArraySchema)
  }),
  factory(ctx) {
    const isAllowed = matchAny(
      (ctx.config?.allow ?? []).map(compileNamespacedNamePattern)
    );

    return {
      validateAll(manifests) {
        manifests.forEach((manifest) => {
          if (!isGatewayRoute(manifest)) return;

          for (const ref of manifest.data.spec?.parentRefs ?? []) {
            const group = ref.group ?? GATEWAY_GROUP;
            const kind = ref.kind ?? GATEWAY_KIND;

            if (group !== GATEWAY_GROUP || kind !== GATEWAY_KIND) continue;

            const name: NamespacedName = {
              name: ref.name,
              namespace: ref.namespace ?? manifest.metadata?.namespace
            };

            if (isAllowed(name)) continue;

            if (
              manifests.find({
                apiGroup: group,
                kind,
                ...name
              })
            ) {
              continue;
            }

            ctx.report(manifest, buildMissingResourceMessage("Gateway", name));
          }
        });
      }
    };
  }
});
