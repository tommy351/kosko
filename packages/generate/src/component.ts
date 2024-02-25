import { isRecord } from "@kosko/common-utils";
import { ComponentInfo } from "./base";

interface Component {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace?: string;
  };
}

function isComponent(value: unknown): value is Component {
  if (!isRecord(value)) return false;

  const { apiVersion, kind, metadata } = value;

  return (
    typeof apiVersion === "string" &&
    typeof kind === "string" &&
    isRecord(metadata) &&
    typeof metadata.name === "string"
  );
}

export function buildComponentInfo(value: unknown): ComponentInfo | undefined {
  if (!isComponent(value)) return;

  return {
    apiVersion: value.apiVersion,
    kind: value.kind,
    name: value.metadata.name,
    namespace: value.metadata.namespace
  };
}
