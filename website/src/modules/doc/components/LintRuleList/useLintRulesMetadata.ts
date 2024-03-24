import { usePluginData } from "@docusaurus/useGlobalData";

export function useLintRulesMetadata() {
  return usePluginData("lint-rules-metadata-plugin") as {
    validateAll: readonly string[];
    presets: {
      recommended: readonly string[];
    };
  };
}

export function includesDocId(list: readonly string[], docId: string): boolean {
  return list.some((id) => docId === `plugins/lint/rules/${id}`);
}
