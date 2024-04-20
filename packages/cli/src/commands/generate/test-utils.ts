import { Manifest } from "@kosko/generate";

export function createManifest(
  value: Partial<Omit<Manifest, "report">> = {}
): Manifest {
  return {
    position: { path: "", index: [] },
    issues: [],
    data: undefined,
    report() {},
    ...value
  };
}
