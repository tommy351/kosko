import React, { FunctionComponent, useMemo } from "react";
import styles from "./styles.module.scss";
import usePlaygroundContext from "../../hooks/usePlaygroundContext";
import MonacoEditor from "../MonacoEditor";
import { ToolbarContainer, ToolbarTitle } from "../Toolbar";

const Editor: FunctionComponent = () => {
  const {
    value: { activePath, files },
    updateValue
  } = usePlaygroundContext();
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
