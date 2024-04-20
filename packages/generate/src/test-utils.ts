/// <reference types="jest-extended" />
import { Manifest } from "./base";

type ManifestToMatch = Pick<Manifest, "data" | "metadata"> &
  Partial<Pick<Manifest, "position" | "issues">>;

export function matchManifest({
  position = { path: "", index: [] },
  issues = [],
  ...manifest
}: ManifestToMatch) {
  return {
    ...manifest,
    position,
    issues,
    report: expect.toBeFunction()
  };
}

export function matchManifests(manifests: ManifestToMatch[]) {
  return manifests.map(matchManifest);
}
