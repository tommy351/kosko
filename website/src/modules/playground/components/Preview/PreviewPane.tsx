import React from "react";
import { ToolbarContainer, ToolbarTitle } from "../Toolbar";
import ComponentSelect from "./ComponentSelect";
import { usePreviewContext } from "./context";
import EnvironmentSelect from "./EnvironmentSelect";
import ProgressBar from "./ProgressBar";
import styles from "./styles.module.scss";
import CodeMirrorEditor from "../CodeMirrorEditor";
import { noop } from "lodash";
import { EditorConfiguration } from "codemirror";

try {
  require("codemirror/mode/yaml/yaml.js");
} catch {
  // ignore error
}

const EDITOR_OPTIONS: EditorConfiguration = {
  readOnly: true,
  mode: "yaml"
};

export default function PreviewPane() {
  const {
    value: { updating, content }
  } = usePreviewContext();

  return (
    <div className={styles.pane}>
      <ToolbarContainer>
        <ToolbarTitle>Preview</ToolbarTitle>
        <ComponentSelect />
        <EnvironmentSelect />
      </ToolbarContainer>
      <div className={styles.previewPaneContent}>
        <CodeMirrorEditor
          className={styles.previewPaneEditor}
          value={content}
          options={EDITOR_OPTIONS}
          onBeforeChange={noop}
        />
        {updating && (
          <div className={styles.previewPaneProgressBar}>
            <ProgressBar />
          </div>
        )}
      </div>
    </div>
  );
}
