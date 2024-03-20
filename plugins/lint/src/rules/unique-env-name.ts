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

          const envNames = new Set<string>();

          for (const env of container.env) {
            if (envNames.has(env.name)) {
              ctx.report(
                manifest,
                `Container "${container.name}" contains multiple environment variables with the same name "${env.name}"`
              );
            } else {
              envNames.add(env.name);
            }
          }
        }
      }
    };
  }
});
