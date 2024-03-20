import { boolean, object, optional } from "superstruct";
import { collectPodContainers, getPodSpec } from "../utils/pod";
import { createRule } from "./types";

export default createRule({
  config: object({
    always: optional(boolean())
  }),
  factory(ctx) {
    const always = ctx.config?.always ?? false;

    return {
      validate(manifest) {
        const podSpec = getPodSpec(manifest.data);
        if (!podSpec) return;

        const containers = collectPodContainers(podSpec);
        const allPorts = containers.flatMap(
          (container) => container.ports ?? []
        );
        if (!allPorts.length) return;
        if (allPorts.length === 1 && !always) return;

        for (const container of containers) {
          for (const port of container.ports ?? []) {
            if (!port.name) {
              ctx.report(
                manifest,
                `Container "${container.name}" must define a name for port ${port.containerPort}.`
              );
            }
          }
        }
      }
    };
  }
});
