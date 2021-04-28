import React, { FunctionComponent, useMemo, useState } from "react";
import {
  Controlled as CodeMirror,
  IControlledCodeMirror
} from "react-codemirror2";
import styles from "./styles.module.scss";
import { EditorConfiguration } from "codemirror";
import useThemeContext from "@theme/hooks/useThemeContext";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/seti.css";

const CodeMirrorEditor: FunctionComponent<IControlledCodeMirror> = ({
  options: inputOptions,
  value,
  editorDidMount,
  ...props
}) => {
  const { isDarkTheme } = useThemeContext();
  const [mounted, setMounted] = useState(false);
  const options = useMemo(
    (): EditorConfiguration => ({
      tabSize: 2,
      theme: isDarkTheme ? "seti" : "default",
      lineNumbers: true,
      ...inputOptions
    }),
    [inputOptions, isDarkTheme]
  );

  return (
    <div className={styles.container}>
      <CodeMirror
        {...props}
        options={options}
        // Update value after the editor is mounted, otherwise some of
        // lines may not be rendered.
        value={mounted ? value : ""}
        editorDidMount={(editor, value, callback) => {
          setMounted(true);
          editorDidMount?.(editor, value, callback);
        }}
      />
    </div>
  );
};

export default CodeMirrorEditor;
