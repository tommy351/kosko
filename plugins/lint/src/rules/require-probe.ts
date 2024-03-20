import { boolean, object, optional } from "superstruct";
import { createRule } from "./types";
import { getPodSpec } from "../utils/pod";

export default createRule({
  config: object({
    readiness: optional(boolean()),
    liveness: optional(boolean()),
    startup: optional(boolean())
  }),
  factory(ctx) {
    const config = ctx.config ?? {};

    return {
      validate(manifest) {
        const podSpec = getPodSpec(manifest.data);
        if (!podSpec || !podSpec.containers?.length) return;

        // initContainers and ephemeralContainers are not required to have probes
        for (const container of podSpec.containers) {
          if (config.readiness && !container.readinessProbe) {
            ctx.report(
              manifest,
              `Container "${container.name}" must define a readiness probe.`
            );
          }

          if (config.liveness && !container.livenessProbe) {
            ctx.report(
              manifest,
              `Container "${container.name}" must define a liveness probe.`
            );
          }

          if (config.startup && !container.startupProbe) {
            ctx.report(
              manifest,
              `Container "${container.name}" must define a startup probe.`
            );
          }
        }
      }
    };
  }
});
