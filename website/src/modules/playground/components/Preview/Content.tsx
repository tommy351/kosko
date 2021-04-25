import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import type * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import styles from "./styles.module.scss";
import MonacoEditor from "../MonacoEditor";
import { createPlaygroundWorker, execute } from "../../worker";
import usePlaygroundContext from "../../hooks/usePlaygroundContext";
import { useThrottle } from "react-use";
import { noop } from "lodash";

let CALLBACK_ID = 0;

const EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = {
  readOnly: true
};

const Content: FunctionComponent = () => {
  const [code, setCode] = useState("");
  const [mounted, setMounted] = useState(false);
  const { value } = usePlaygroundContext();
  const files = useThrottle(value.files, 1000);
  const worker = useMemo(() => createPlaygroundWorker(), []);

  useEffect(() => {
    if (!mounted) return;

    const id = `__koskoPreview_${CALLBACK_ID++}`;
    let canceled = false;
    let dispose: () => void = noop;

    (async () => {
      const result = await worker.bundle({
        files,
        component: value.component,
        environment: value.environment,
        callback: `window.${id}`
      });

      if (canceled) return;

      // TODO: Handle bundle warnings

      dispose = execute(id, result.code, (err, code) => {
        if (err) {
          // TODO: Handle error
          return;
        }

        setCode(code);
      });
    })();

    return () => {
      canceled = true;
      dispose();
    };
  }, [mounted, files, value.component, value.environment]);

  return (
    <div className={styles.editor}>
      <MonacoEditor
        language="yaml"
        value={code}
        options={EDITOR_OPTIONS}
        onMount={() => {
          setMounted(true);
        }}
      />
    </div>
  );
};

export default Content;
