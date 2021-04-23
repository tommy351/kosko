import { useMemo } from "react";
import { basename, extname } from "../../../utils/path";
import { usePlayground } from "../context";

export default function useComponentList(): readonly string[] {
  const {
    value: { files }
  } = usePlayground();

  return useMemo(
    () =>
      Object.keys(files)
        .map((path) => path.substring(1).split("/"))
        .filter(([dir, name]) => dir === "components" && name.endsWith(".js"))
        .map(([, name]) => basename(name, extname(name))),
    [files]
  );
}
