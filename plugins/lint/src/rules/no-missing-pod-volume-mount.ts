import { isStatefulSet } from "../utils/manifest";
import { collectPodContainers, getPodSpec } from "../utils/pod";
import { createRule } from "./types";

export default createRule({
  factory(ctx) {
    return {
      validate(manifest) {
        const podSpec = getPodSpec(manifest.data);
        if (!podSpec) return;

        const volumeNames = new Set(podSpec.volumes?.map((v) => v.name));

        if (isStatefulSet(manifest)) {
          const volumes = manifest.data.spec?.volumeClaimTemplates ?? [];

          for (const volume of volumes) {
            const name = volume.metadata?.name;
            if (name) volumeNames.add(name);
          }
        }

        for (const container of collectPodContainers(podSpec)) {
          if (!container.volumeMounts?.length) continue;

          for (const volumeMount of container.volumeMounts) {
            if (!volumeNames.has(volumeMount.name)) {
              ctx.report(
                manifest,
                `Volume "${volumeMount.name}" is not defined in volumes.`
              );
            }
          }
        }
      }
    };
  }
});
