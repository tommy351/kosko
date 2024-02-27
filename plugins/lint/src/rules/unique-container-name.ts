import { collectPodContainers, getPodSpec } from "../utils/pod";
import { createRule } from "./types";

export default createRule({
  factory(ctx) {
    return {
      validate(manifest) {
        const podSpec = getPodSpec(manifest.data);
        if (!podSpec) return;

        const containerNames = new Set<string>();

        for (const container of collectPodContainers(podSpec)) {
          if (!container.name) return;

          if (containerNames.has(container.name)) {
            ctx.report(
              manifest,
              `Pod contains multiple containers with the same name "${container.name}"`
            );
          } else {
            containerNames.add(container.name);
          }
        }
      }
    };
  }
});
