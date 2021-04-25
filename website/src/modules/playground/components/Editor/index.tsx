import React, { FunctionComponent, useMemo } from "react";
import styles from "./styles.module.scss";
import usePlaygroundContext from "../../hooks/usePlaygroundContext";
import MonacoEditor from "../MonacoEditor";
import { ToolbarContainer, ToolbarTitle } from "../Toolbar";
import type * as monaco from "monaco-editor/esm/vs/editor/editor.api";

const Editor: FunctionComponent = () => {
  const {
    value: { activePath, files },
    updateValue
  } = usePlaygroundContext();
  const value = useMemo(() => files[activePath] || "", [activePath, files]);
  const editorOptions = useMemo(
    (): monaco.editor.IStandaloneEditorConstructionOptions => ({
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
        <MonacoEditor
          language="javascript"
          path={activePath}
          value={value}
          options={editorOptions}
          onChange={(value) => {
            if (!activePath) return;

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
