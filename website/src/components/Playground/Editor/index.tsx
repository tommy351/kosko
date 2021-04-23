import React, { FunctionComponent, useMemo } from "react";
import styles from "./styles.module.scss";
import { usePlayground } from "../context";
import MonacoEditor from "../MonacoEditor";
import { ToolbarContainer, ToolbarTitle } from "../Toolbar";

const Editor: FunctionComponent = () => {
  const {
    value: { activePath, files },
    updateValue
  } = usePlayground();
  const value = useMemo(() => files[activePath], [activePath, files]);

  return (
    <div className={styles.container}>
      <ToolbarContainer>
        <ToolbarTitle>Editor</ToolbarTitle>
        <div className={styles.activePath}>{activePath}</div>
      </ToolbarContainer>
      <div className={styles.editor}>
        <MonacoEditor
          language="javascript"
          path={activePath}
          value={value}
          onMount={() => {
            updateValue((draft) => {
              draft.editorMounted = true;
            });
          }}
          onChange={(value) => {
            updateValue((draft) => {
              draft.files[activePath] = value;
            });
          }}
        />
      </div>
    </div>
  );
};

export default Editor;
