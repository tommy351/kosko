import { boolean, object, optional } from "superstruct";
import { getPodSpec } from "../utils/pod";
import { createRule } from "./types";

export default createRule({
  config: object({
    init: optional(boolean()),
    ephemeral: optional(boolean())
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
          }
        }
      }
    };
  }
});
