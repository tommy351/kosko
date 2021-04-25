import React, { FunctionComponent } from "react";
import MonacoEditor from "../MonacoEditor";
import { ToolbarContainer, ToolbarTitle } from "../Toolbar";
import ComponentSelect from "./ComponentSelect";
import { usePreviewContext } from "./context";
import EnvironmentSelect from "./EnvironmentSelect";
import ProgressBar from "./ProgressBar";
import styles from "./styles.module.scss";
import type * as monaco from "monaco-editor/esm/vs/editor/editor.api";

const EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = {
  readOnly: true
};

const PreviewPane: FunctionComponent = () => {
  const {
    value: { updating, content },
    updateValue
  } = usePreviewContext();

  return (
    <div className={styles.pane}>
      <ToolbarContainer>
        <ToolbarTitle>Preview</ToolbarTitle>
        <ComponentSelect />
        <EnvironmentSelect />
      </ToolbarContainer>
      <div className={styles.previewPaneContent}>
        <MonacoEditor
          className={styles.previewPaneEditor}
          language="yaml"
          value={content}
          options={EDITOR_OPTIONS}
          onMount={() => {
            updateValue((draft) => {
              draft.mounted = true;
            });
          }}
        />
        {updating && (
          <div className={styles.previewPaneProgressBar}>
            <ProgressBar />
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPane;
