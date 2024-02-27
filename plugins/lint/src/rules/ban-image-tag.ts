import { array, object, optional, string } from "superstruct";
import { collectPodContainers, getPodSpec } from "../utils/pod";
import { createRule } from "./types";

export default createRule({
  config: object({
    tags: optional(array(string()))
  }),
  factory(ctx) {
    const tags = new Set(ctx.config?.tags ?? []);

    return {
      validate(manifest) {
        const podSpec = getPodSpec(manifest.data);
        if (!podSpec) return;

        for (const container of collectPodContainers(podSpec)) {
          const image = container.image;
          if (!image) return;

          const parts = image.split(":");
          if (parts.length === 1) return;

          const tag = parts.slice(1).join(":");

          if (tags.has(tag)) {
            ctx.report(
              manifest,
              `Image in container "${container.name}" must not use the "${tag}" tag`
            );
          }
        }
      }
    };
  }
});
