import { collectPodContainers, getPodSpec } from "../utils/pod";
import { createRule } from "./types";

export default createRule({
  factory(ctx) {
    return {
      validate(manifest) {
        const podSpec = getPodSpec(manifest.data);
        if (!podSpec) return;

        const containers = collectPodContainers(podSpec);
        const allPorts = containers.flatMap(
          (container) => container.ports ?? []
        );
        if (allPorts.length <= 1) return;

        const portNames = new Map<string, string>();

        for (const container of containers) {
          for (const port of container.ports ?? []) {
            if (!port.name) continue;

            const existing = portNames.get(port.name);

            if (existing) {
              ctx.report(
                manifest,
                `Port name "${port.name}" is already used by container "${existing}".`
              );
            } else if (container.name) {
              portNames.set(port.name, container.name);
            }
          }
        }
      }
    };
  }
});
