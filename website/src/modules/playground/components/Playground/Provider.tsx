import { sep } from "@site/src/utils/path";
import React, { ReactNode, useMemo } from "react";
import { useImmer } from "use-immer";
import { DIRECTORY_PLACEHOLDER } from "../../constants";
import { PlaygroundContext, PlaygroundContextValue } from "../../context";

const fixturesContext = require.context(
  "!!raw-loader!../../fixtures",
  true,
  /\.js$/
);
const fixtures = Object.fromEntries(
  fixturesContext
    .keys()
    .map((key) => [key.substring(1), fixturesContext(key).default])
);

function insertPlaceholder(
  files: Record<string, string>
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [k, v] of Object.entries(files)) {
    result[k] = v;

    const parts = k.split(sep);

    for (let i = 1; i < parts.length; i++) {
      const path = [...parts.slice(0, i), DIRECTORY_PLACEHOLDER].join(sep);
      result[path] = "";
    }
  }

  return result;
}

export default function Provider({ children }: { children?: ReactNode }) {
  const [value, updateValue] = useImmer<PlaygroundContextValue>(() => ({
    activePath: Object.keys(fixtures)[0],
    files: insertPlaceholder(fixtures),
    component: "mongo",
    environment: "dev",
    editorMounted: false
  }));
  const ctx = useMemo(() => ({ value, updateValue }), [value, updateValue]);

  return (
    <PlaygroundContext.Provider value={ctx}>
      {children}
    </PlaygroundContext.Provider>
  );
}
