import React, { FunctionComponent, useEffect, useState } from "react";
import { usePlayground } from "../context";
import styles from "./styles.module.scss";
import useRollup from "../hooks/useRollup";
import generateBundle from "./generateBundle";
import executeModule from "./executeModule";
import MonacoEditor from "../MonacoEditor";

let CALLBACK_ID = 0;

const Preview: FunctionComponent = () => {
  const rollup = useRollup();
  const [code, setCode] = useState("");
  const {
    value: { component, environment, files }
  } = usePlayground();

  useEffect(() => {
    if (!rollup) return;

    const callbackId = `__koskoPreview${CALLBACK_ID++}`;
    let scriptElement: HTMLScriptElement | undefined;
    let canceled = false;

    (window as any)[callbackId] = (result) => {
      if (canceled) return;
      setCode(result);
    };

    (async () => {
      const result = await generateBundle({
        rollup,
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
  }, [rollup, files, component, environment]);

  return (
    <div className={styles.container}>
      <MonacoEditor language="yaml" value={code} options={{ readOnly: true }} />
    </div>
  );
};

export default Preview;
