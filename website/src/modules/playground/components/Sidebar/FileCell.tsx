import React, { FunctionComponent } from "react";
import usePlaygroundContext from "../../hooks/usePlaygroundContext";
import { File } from "./types";
import { FcFile } from "react-icons/fc";
import Cell from "./Cell";
import FileAction from "./FileAction";

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
      action={<FileAction path={entry.path} />}
      active={activePath === entry.path}
      onClick={() => {
        updateValue((draft) => {
          draft.activePath = entry.path;
        });
      }}
    />
  );
};

export default FileCell;
