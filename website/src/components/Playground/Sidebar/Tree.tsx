import React, { FunctionComponent } from "react";
import cx from "clsx";
import { usePlayground } from "../context";
import styles from "./styles.module.scss";

const Tree: FunctionComponent<{
  files: string[];
}> = ({ files }) => {
  const {
    value: { activePath },
    updateValue
  } = usePlayground();

  return (
    <div>
      {files.map((file) => (
        <button
          key={file}
          type="button"
          className={cx({
            [styles.activeFile]: activePath === file
          })}
          onClick={() => {
            updateValue((draft) => {
              draft.activePath = file;
            });
          }}
        >
          {file}
        </button>
      ))}
    </div>
  );
};

export default Tree;
