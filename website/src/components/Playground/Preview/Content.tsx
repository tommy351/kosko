import React, { FunctionComponent, useEffect, useState } from "react";
import { usePlayground } from "../context";
import styles from "./styles.module.scss";
import generateBundle from "./generateBundle";
import executeModule from "./executeModule";
import MonacoEditor from "../MonacoEditor";
import { useThrottle } from "react-use";

let CALLBACK_ID = 0;

const Content: FunctionComponent = () => {
  const [code, setCode] = useState("");
  const {
    value: { component, environment, files: filesValue }
  } = usePlayground();
  const files = useThrottle(filesValue, 500);

  useEffect(() => {
    const callbackId = `__koskoPreview${CALLBACK_ID++}`;
    let scriptElement: HTMLScriptElement | undefined;
    let canceled = false;

    (window as any)[callbackId] = (result) => {
      if (canceled) return;
      setCode(result);
    };

    (async () => {
      const result = await generateBundle({
        files,
        component,
        environment,
        callbackId
      });

      scriptElement = executeModule(result);
      scriptElement.id = callbackId;
    })();

    return () => {
      canceled = true;

      delete (window as any)[callbackId];

      if (scriptElement) {
        scriptElement.remove();
      }
    };
  }, [files, component, environment]);

  return (
    <div className={styles.editor}>
      <MonacoEditor language="yaml" value={code} options={{ readOnly: true }} />
    </div>
  );
};

export default Content;
