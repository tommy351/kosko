import { useMemo } from "react";
import usePlaygroundContext from "./usePlaygroundContext";
import { sep } from "@site/src/utils/path";
import { ENVIRONMENT_DIR } from "../constants";

export default function useEnvironmentList(): string[] {
  const {
    value: { files }
  } = usePlaygroundContext();

  return useMemo(() => {
    const result: Record<string, boolean> = {};

    for (const key of Object.keys(files)) {
      // The path must be placed in the components directory.
      if (!key.startsWith(ENVIRONMENT_DIR)) continue;

      const [name, ...rest] = key.substring(ENVIRONMENT_DIR.length).split(sep);

      // If `rest` is empty, it means the path is not a directory, so skip it.
      if (!rest.length) continue;

      result[name] = true;
    }

    return Object.keys(result).sort();
  }, [files]);
}
