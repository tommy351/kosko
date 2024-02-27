import { collectPodContainers, getPodSpec } from "../utils/pod";
import { createRule } from "./types";

export default createRule({
  factory(ctx) {
    return {
      validate(manifest) {
        const podSpec = getPodSpec(manifest.data);
        if (!podSpec) return;

        for (const container of collectPodContainers(podSpec)) {
          if (!container.image) {
            ctx.report(
              manifest,
              `Container "${container.name}" must define an image.`
            );
          }
        }
      }
    };
  }
});
