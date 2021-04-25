import React, { FunctionComponent, useMemo } from "react";
import Editor, { EditorProps } from "@monaco-editor/react";
import useThemeContext from "@theme/hooks/useThemeContext";

const MonacoEditor: FunctionComponent<EditorProps> = ({
  options: inputOptions,
  ...props
}) => {
  const { isDarkTheme } = useThemeContext();
  const options = useMemo(
    () => ({ tabSize: 2, minimap: { enabled: false }, ...inputOptions }),
    [inputOptions]
  );

  return (
    <Editor
      theme={isDarkTheme ? "vs-dark" : "light"}
      {...props}
      options={options}
    />
  );
};

export default MonacoEditor;
