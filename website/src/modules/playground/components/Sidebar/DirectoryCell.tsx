import React from "react";
import { Directory } from "./types";
import { FcFolder } from "react-icons/fc";
import Cell from "./Cell";
import Tree from "./Tree";
import DirectoryAction from "./DirectoryAction";

export default function DirectoryCell({
  entry,
  depth
}: {
  entry: Directory;
  depth: number;
}) {
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
}
