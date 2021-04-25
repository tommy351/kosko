import React, { FunctionComponent } from "react";
import clsx from "clsx";
import usePlaygroundContext from "../../hooks/usePlaygroundContext";
import styles from "./styles.module.scss";
import { File } from "./types";
import { FcFile } from "react-icons/fc";
import Cell from "./Cell";

const FileCell: FunctionComponent<{ entry: File; depth: number }> = ({
  entry,
  depth
}) => {
  const {
    value: { activePath },
    updateValue
  } = usePlaygroundContext();

  return (
    <Cell
      entry={entry}
      icon={<FcFile />}
      depth={depth}
      className={clsx({
        [styles.cellButtonActive]: activePath === entry.path
      })}
      onClick={() => {
        updateValue((draft) => {
          draft.activePath = entry.path;
        });
      }}
    />
  );
};

export default FileCell;
