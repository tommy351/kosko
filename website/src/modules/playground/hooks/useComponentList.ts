import { useMemo } from "react";
import usePlaygroundContext from "./usePlaygroundContext";
import { sep } from "@site/src/utils/path";
import { COMPONENT_DIR, JS_EXT } from "../constants";

export default function useComponentList(): string[] {
  const {
    value: { files }
  } = usePlaygroundContext();

  return useMemo(() => {
    const result: string[] = [];

    for (const key of Object.keys(files)) {
      // The path must be placed in the components directory.
      if (!key.startsWith(COMPONENT_DIR)) continue;

      const name = key.substring(COMPONENT_DIR.length);

      // The path must not be a directory.
      if (name.includes(sep)) continue;

      // The path must be a .js file.
      if (!name.endsWith(JS_EXT)) continue;

      result.push(name.substring(0, name.length - JS_EXT.length));
    }

    return result.sort();
  }, [files]);
}
