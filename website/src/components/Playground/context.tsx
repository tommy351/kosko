import React, {
  createContext,
  FunctionComponent,
  useContext,
  useMemo
} from "react";
import { noop } from "lodash";
import { Draft } from "immer";
import { useImmer } from "use-immer";

interface ContextValue {
  activePath: string;
  files: Record<string, string>;
  component: string;
  environment: string;
}

const PlaygroundContext = createContext<{
  value: ContextValue;
  updateValue(callback: (draft: Draft<ContextValue>) => void): void;
}>({
  value: {
    activePath: "",
    files: {},
    component: "",
    environment: ""
  },
  updateValue: noop
});

export function usePlayground() {
  return useContext(PlaygroundContext);
}

export const PlaygroundProvider: FunctionComponent = ({ children }) => {
  const [value, updateValue] = useImmer<ContextValue>(() => ({
    activePath: "/components/nginx.js",
    files: {
      /* eslint-disable @typescript-eslint/no-var-requires */
      "/components/nginx.js": require("!!raw-loader!./fixtures/components/nginx.js")
        .default,
      "/environments/dev/index.js": require("!!raw-loader!./fixtures/environments/dev/index.js")
        .default,
      "/environments/dev/nginx.js": require("!!raw-loader!./fixtures/environments/dev/nginx.js")
        .default,
      "/environments/prod/index.js": require("!!raw-loader!./fixtures/environments/prod/index.js")
        .default,
      "/environments/prod/nginx.js": require("!!raw-loader!./fixtures/environments/prod/nginx.js")
        .default
      /* eslint-enable @typescript-eslint/no-var-requires */
    },
    component: "nginx",
    environment: "dev"
  }));
  const ctx = useMemo(() => ({ value, updateValue }), [value, updateValue]);

  return (
    <PlaygroundContext.Provider value={ctx}>
      {children}
    </PlaygroundContext.Provider>
  );
};
