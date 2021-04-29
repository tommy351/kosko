import { Draft } from "immer";
import { createContext } from "react";
import { noop } from "lodash";

export interface PlaygroundContextValue {
  activePath?: string;
  files: Record<string, string>;
  component: string;
  environment: string;
}

export const PlaygroundContext = createContext<{
  value: PlaygroundContextValue;
  updateValue(callback: (draft: Draft<PlaygroundContextValue>) => void): void;
}>({
  value: {
    files: {},
    component: "",
    environment: ""
  },
  updateValue: noop
});
