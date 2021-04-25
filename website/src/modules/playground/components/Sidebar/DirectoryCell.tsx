import React, { FunctionComponent } from "react";
import { Directory } from "./types";
import { FcFolder } from "react-icons/fc";
import Cell from "./Cell";
import Tree from "./Tree";
import DirectoryAction from "./DirectoryAction";

const DirectoryCell: FunctionComponent<{ entry: Directory; depth: number }> = ({
  entry,
  depth
}) => {
  return (
    <Cell
      entry={entry}
      icon={<FcFolder />}
      depth={depth}
      action={<DirectoryAction path={entry.path} showFileActions />}
    >
      <Tree entries={entry.children} depth={depth + 1} />
    </Cell>
  );
};

export default DirectoryCell;
