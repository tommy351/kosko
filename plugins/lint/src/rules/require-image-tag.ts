import { collectPodContainers, getPodSpec } from "../utils/pod";
import { createRule } from "./types";

export default createRule({
  factory(ctx) {
    return {
      validate(manifest) {
        const podSpec = getPodSpec(manifest.data);
        if (!podSpec) return;

        for (const container of collectPodContainers(podSpec)) {
          if (!container.image) continue;

          const parts = container.image.split(":");

          if (parts.length < 2 || !parts[1]) {
            ctx.report(
              manifest,
              `Image in container "${container.name}" must use a tag`
            );
          }
        }
      }
    };
  }
});
