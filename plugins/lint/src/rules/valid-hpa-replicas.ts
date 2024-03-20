import { isHPA } from "../utils/manifest";
import { createRule } from "./types";

export default createRule({
  factory(ctx) {
    return {
      validate(manifest) {
        if (!isHPA(manifest)) return;

        const { minReplicas = 0, maxReplicas } = manifest.data.spec ?? {};

        if (minReplicas < 0) {
          ctx.report(manifest, "minReplicas must be at least 0");
        }

        if (typeof maxReplicas !== "number") {
          ctx.report(manifest, "maxReplicas must be a number");

          return;
        }

        if (maxReplicas < 1) {
          ctx.report(manifest, "maxReplicas must be at least 1");
        }

        if (minReplicas > maxReplicas) {
          ctx.report(
            manifest,
            "minReplicas must be less than or equal to maxReplicas"
          );
        }
      }
    };
  }
});
