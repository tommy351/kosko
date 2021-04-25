import { sep } from "@site/src/utils/path";
import React, { FunctionComponent, useMemo } from "react";
import { useImmer } from "use-immer";
import {
  COMPONENT_DIR,
  ENVIRONMENT_DIR,
  JS_EXT,
  MODULE_ENTRY
} from "../../constants";
import { PlaygroundContext, PlaygroundContextValue } from "../../context";

const Provider: FunctionComponent = ({ children }) => {
  const [value, updateValue] = useImmer<PlaygroundContextValue>(() => ({
    activePath: `${COMPONENT_DIR}nginx${JS_EXT}`,
    files: {
      /* eslint-disable @typescript-eslint/no-var-requires */
      [`${COMPONENT_DIR}nginx${JS_EXT}`]: require("!!raw-loader!../../fixtures/components/nginx.js")
        .default,
      [`${ENVIRONMENT_DIR}dev${sep}${MODULE_ENTRY}`]: require("!!raw-loader!../../fixtures/environments/dev/index.js")
        .default,
      [`${ENVIRONMENT_DIR}dev${sep}nginx${JS_EXT}`]: require("!!raw-loader!../../fixtures/environments/dev/nginx.js")
        .default,
      [`${ENVIRONMENT_DIR}prod${sep}${MODULE_ENTRY}`]: require("!!raw-loader!../../fixtures/environments/prod/index.js")
        .default,
      [`${ENVIRONMENT_DIR}prod${sep}nginx${JS_EXT}`]: require("!!raw-loader!../../fixtures/environments/prod/nginx.js")
        .default
      /* eslint-enable @typescript-eslint/no-var-requires */
    },
    component: "nginx",
    environment: "dev",
    editorMounted: false
  }));
  const ctx = useMemo(() => ({ value, updateValue }), [value, updateValue]);

  return (
    <PlaygroundContext.Provider value={ctx}>
      {children}
    </PlaygroundContext.Provider>
  );
};

export default Provider;
