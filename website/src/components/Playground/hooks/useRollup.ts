import type * as rollup from "rollup";
import useScript, { ScriptLoadStatus } from "../../../hooks/useScript";

export default function useRollup(): typeof rollup | undefined {
  const status = useScript(
    "https://unpkg.com/rollup@2.45.2/dist/rollup.browser.js"
  );

  if (status !== ScriptLoadStatus.Ready) return;

  return (window as any).rollup;
}
