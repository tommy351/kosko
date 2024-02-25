import { getPodSpec } from "../utils/pod";
import { createRule } from "./types";

export default createRule({
  factory(ctx) {
    return {
      validate(manifest) {
        const podSpec = getPodSpec(manifest.data);
        if (!podSpec || !podSpec.containers?.length) return;

        const volumeNames = new Set(podSpec.volumes?.map((v) => v.name));

        for (const container of podSpec.containers) {
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
