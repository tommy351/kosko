import { type ValidateResult, createRule } from "./base";
import { getPodSpec } from "../utils/pod-spec";

export default createRule({
  validate(ctx, manifest) {
    const results: ValidateResult[] = [];

    const result = getPodSpec(manifest.data);
    if (!result) return results;

    const containers = result.spec.containers;
    if (!containers.length) return results;

    const volumeNames = new Set(result.spec.volumes?.map((v) => v.name));

    for (let i = 0; i < containers.length; i++) {
      const volumeMounts = containers[i].volumeMounts;
      if (!volumeMounts?.length) continue;

      for (let j = 0; j < volumeMounts.length; j++) {
        const name = volumeMounts[j].name;

        if (!volumeNames.has(name)) {
          results.push({
            path: [
              ...result.kind.path,
              "spec",
              "containers",
              `${i}`,
              "volumeMounts",
              `${j}`,
              "name"
            ],
            message: `Volume "${name}" does not exist.`
          });
        }
      }
    }

    return results;
  }
});
