import { array, object, optional, string } from "superstruct";
import { createRule } from "./types";
import { compilePattern, matchAny } from "../utils/pattern";
import {
  GATEWAY_GROUP,
  buildMissingResourceMessage,
  isGateway
} from "../utils/manifest";

export default createRule({
  config: object({
    allow: optional(array(string()))
  }),
  factory(ctx) {
    const isAllowed = matchAny((ctx.config?.allow ?? []).map(compilePattern));

    return {
      validateAll(manifests) {
        manifests.forEach((manifest) => {
          if (!isGateway(manifest)) return;

          const name = manifest.data.spec?.gatewayClassName;
          if (!name) return;

          if (isAllowed(name)) return;

          if (
            manifests.find({
              apiGroup: GATEWAY_GROUP,
              kind: "GatewayClass",
              name
            })
          ) {
            return;
          }

          ctx.report(
            manifest,
            buildMissingResourceMessage("GatewayClass", { name })
          );
        });
      }
    };
  }
});
