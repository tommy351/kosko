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

try {
  require("codemirror/addon/edit/matchbrackets.js");
  require("codemirror/addon/edit/closebrackets.js");
} catch {
  // Ignore errors
}

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
      matchBrackets: true,
      autoCloseBrackets: true,
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
