import { shallowObjectContains } from "../utils/object";
import { getDeploymentLikeSpec } from "../utils/deployment";
import { createRule } from "./types";

export default createRule({
  factory(ctx) {
    return {
      validate(manifest) {
        const spec = getDeploymentLikeSpec(manifest.data);
        if (!spec) return;

        const selector = spec.selector?.matchLabels;
        if (!selector) return;

        if (Object.keys(selector).length === 0) {
          ctx.report(manifest, "Pod selector must not be empty");
        }

        const labels = spec.template?.metadata?.labels ?? {};

        if (!shallowObjectContains(labels, selector)) {
          ctx.report(manifest, "Pod selector must match template labels");
        }
      }
    };
  }
});
