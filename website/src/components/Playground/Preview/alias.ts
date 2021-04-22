import type { Plugin } from "rollup";

export default function createAliasPlugin(
  aliases: Record<string, string>
): Plugin {
  return {
    name: "alias",
    resolveId(source) {
      const alias = aliases[source];
      if (alias) return alias;
    }
  };
}
