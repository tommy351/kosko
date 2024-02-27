import { isRecord } from "@kosko/common-utils";
import { createRule } from "./types";

export default createRule({
  factory(ctx) {
    return {
      validate(manifest) {
        if (!isRecord(manifest.data)) return;

        const { metadata } = manifest.data;

        if (!isRecord(metadata) || !metadata.namespace) {
          ctx.report(manifest, "Namespace must not be empty.");
        }
      }
    };
  }
});
