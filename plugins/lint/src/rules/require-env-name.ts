import { collectPodContainers, getPodSpec } from "../utils/pod";
import { createRule } from "./types";

export default createRule({
  factory(ctx) {
    return {
      validate(manifest) {
        const podSpec = getPodSpec(manifest.data);
        if (!podSpec) return;

        for (const container of collectPodContainers(podSpec)) {
          if (!container.env?.length) continue;

          for (const env of container.env) {
            if (!env.name) {
              ctx.report(
                manifest,
                `Container "${container.name}" contains an environment variable without a name.`
              );
            }
          }
        }
      }
    };
  }
});
