import { object, optional } from "superstruct";
import { createRule } from "./types";
import {
  type NamespacedName,
  isPVC,
  namespacedNameArraySchema,
  buildMissingResourceMessage,
  compileNamespacedNamePattern
} from "../utils/manifest";
import { matchAny } from "../utils/pattern";

export default createRule({
  config: object({
    allow: optional(namespacedNameArraySchema)
  }),
  factory(ctx) {
    const isAllowed = matchAny(
      (ctx.config?.allow ?? []).map(compileNamespacedNamePattern)
    );

    return {
      validateAll(manifests) {
        manifests.forEach((manifest) => {
          if (!isPVC(manifest)) return;

          const volumeName = manifest.data.spec?.volumeName;
          if (!volumeName) return;

          const name: NamespacedName = {
            namespace: manifest.metadata?.namespace,
            name: volumeName
          };

          if (isAllowed(name)) return;

          if (
            manifests.find({
              apiGroup: "",
              kind: "PersistentVolume",
              ...name
            })
          ) {
            return;
          }

          ctx.report(
            manifest,
            buildMissingResourceMessage("Persistent volume", name)
          );
        });
      }
    };
  }
});
