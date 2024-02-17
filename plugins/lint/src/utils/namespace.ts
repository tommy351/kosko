import { isRecord } from "@kosko/common-utils";
import type { INamespace } from "kubernetes-models/v1/Namespace";

export function isNamespace(value: unknown): value is INamespace {
  return (
    isRecord(value) && value.apiVersion === "v1" && value.kind === "Namespace"
  );
}
