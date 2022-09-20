/// <reference types="codemirror/addon/edit/matchbrackets"/>
/// <reference types="codemirror/addon/edit/closebrackets"/>

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Controlled as CodeMirror,
  IControlledCodeMirror
} from "react-codemirror2";
import styles from "./styles.module.scss";
import { Editor, EditorConfiguration } from "codemirror";
import { useColorMode } from "@docusaurus/theme-common";
import { usePrevious } from "react-use";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/seti.css";

try {
  require("codemirror/addon/edit/matchbrackets.js");
  require("codemirror/addon/edit/closebrackets.js");
} catch {
  // Ignore errors
}

export interface CodeMirrorEditorProps extends IControlledCodeMirror {
  path?: string;
}

export default function CodeMirrorEditor({
  options: inputOptions,
  value,
  editorDidMount,
  path,
  ...props
}: CodeMirrorEditorProps) {
  const { colorMode } = useColorMode();
  const isDarkTheme = colorMode === "dark";
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
  const editorRef = useRef<Editor>(null);
  const previousPath = usePrevious(path);

  useEffect(() => {
    if (!editorRef.current) return;
    if (previousPath === path) return;

    editorRef.current.setCursor(0, 0);
  }, [path, previousPath]);

  return (
    <div className={styles.container}>
      <CodeMirror
        {...props}
        options={options}
        // Update value after the editor is mounted, otherwise some of
        // lines may not be rendered.
        value={mounted ? value : ""}
        editorDidMount={(editor, value, callback) => {
          editorRef.current = editor;
          setMounted(true);
          editorDidMount?.(editor, value, callback);
        }}
      />
    </div>
  );
}
