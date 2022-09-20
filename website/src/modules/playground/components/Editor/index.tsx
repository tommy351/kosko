import React, { useMemo } from "react";
import styles from "./styles.module.scss";
import usePlaygroundContext from "../../hooks/usePlaygroundContext";
import { ToolbarContainer, ToolbarTitle } from "../Toolbar";
import CodeMirrorEditor from "../CodeMirrorEditor";
import { EditorConfiguration } from "codemirror";

try {
  require("codemirror/mode/javascript/javascript.js");
} catch {
  // ignore error
}

export default function Editor() {
  const {
    value: { activePath, files },
    updateValue
  } = usePlaygroundContext();
  const value = useMemo(() => files[activePath] || "", [activePath, files]);
  const editorOptions = useMemo(
    (): EditorConfiguration => ({
      mode: "javascript",
      readOnly: !activePath
    }),
    [activePath]
  );

  return (
    <div className={styles.container}>
      <ToolbarContainer>
        <ToolbarTitle>Editor</ToolbarTitle>
        {activePath && <div className={styles.activePath}>{activePath}</div>}
      </ToolbarContainer>
      <div className={styles.editor}>
        <CodeMirrorEditor
          path={activePath}
          value={value}
          options={editorOptions}
          onBeforeChange={(editor, data, value) => {
            if (!activePath) return;

            updateValue((draft) => {
              draft.files[activePath] = value;
            });
          }}
        />
      </div>
    </div>
  );
}
