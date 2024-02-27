import { object, optional } from "superstruct";
import { createRule } from "./types";
import {
  type NamespacedName,
  isPVC,
  namespacedNameArraySchema,
  containNamespacedName,
  buildMissingResourceMessage
} from "../utils/manifest";

export default createRule({
  config: object({
    allow: optional(namespacedNameArraySchema)
  }),
  factory(ctx) {
    const allow = ctx.config?.allow ?? [];

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

          if (containNamespacedName(allow, name)) return;

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
