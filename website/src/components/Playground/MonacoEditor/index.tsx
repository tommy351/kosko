import React, { FunctionComponent } from "react";
import Editor, { EditorProps } from "@monaco-editor/react";
// eslint-disable-next-line node/no-missing-import
import useThemeContext from "@theme/hooks/useThemeContext";

const MonacoEditor: FunctionComponent<EditorProps> = ({
  options,
  ...props
}) => {
  const { isDarkTheme } = useThemeContext();

  return (
    <Editor
      theme={isDarkTheme ? "vs-dark" : "light"}
      {...props}
      options={{
        ...options,
        tabSize: 2,
        minimap: { enabled: false }
      }}
    />
  );
};

export default MonacoEditor;
