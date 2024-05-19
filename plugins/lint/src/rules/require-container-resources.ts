import { array, boolean, object, optional, string } from "superstruct";
import { getPodSpec } from "../utils/pod";
import { createRule } from "./types";
import { difference } from "../utils/array";

export default createRule({
  config: object({
    init: optional(boolean()),
    ephemeral: optional(boolean()),
    requests: optional(array(string())),
    limits: optional(array(string()))
  }),
  factory(ctx) {
    const config = ctx.config ?? {};

    return {
      validate(manifest) {
        const podSpec = getPodSpec(manifest.data);
        if (!podSpec) return;

        const containers = [
          ...(podSpec.containers ?? []),
          ...((config.init && podSpec.initContainers) || []),
          ...((config.ephemeral && podSpec.ephemeralContainers) || [])
        ];

        for (const container of containers) {
          if (!container.resources) {
            ctx.report(
              manifest,
              `Container "${container.name}" must define resources.`
            );
            continue;
          }

          if (config.requests?.length) {
            const missing = difference(
              config.requests,
              Object.keys(container.resources.requests ?? {})
            );

            if (missing.length) {
              ctx.report(
                manifest,
                `Container "${container.name}" must define requests for: ${missing.join(
                  ", "
                )}.`
              );
            }
          }

          if (config.limits?.length) {
            const missing = difference(
              config.limits,
              Object.keys(container.resources.limits ?? {})
            );

            if (missing.length) {
              ctx.report(
                manifest,
                `Container "${container.name}" must define limits for: ${missing.join(
                  ", "
                )}.`
              );
            }
          }
        }
      }
    };
  }
});
