import { useMemo } from "react";
import { uniq } from "lodash";
import { usePlayground } from "../context";

export default function useEnvironmentList(): readonly string[] {
  const {
    value: { files }
  } = usePlayground();

  return useMemo(() => {
    const keys = Object.keys(files)
      .map((path) => path.substring(1).split("/"))
      .filter(([dir, name]) => dir === "environments" && !name.endsWith(".js"))
      .map(([, name]) => name);

    return uniq(keys);
  }, [files]);
}
