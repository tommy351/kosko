import { array, object, optional, string } from "superstruct";
import { collectPodContainers, getPodSpec } from "../utils/pod";
import { createRule } from "./types";
import { compilePattern, matchAny } from "../utils/pattern";

export default createRule({
  config: object({
    images: optional(array(string()))
  }),
  factory(ctx) {
    const match = matchAny((ctx.config?.images ?? []).map(compilePattern));

    return {
      validate(manifest) {
        const podSpec = getPodSpec(manifest.data);
        if (!podSpec) return;

        for (const container of collectPodContainers(podSpec)) {
          const image = container.image;

          if (image && match(image)) {
            ctx.report(
              manifest,
              `Container "${container.name}" uses the banned image "${image}".`
            );
          }
        }
      }
    };
  }
});
