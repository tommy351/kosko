import React, { FunctionComponent } from "react";
import { Entry, EntryType } from "./types";
import DirectoryCell from "./DirectoryCell";
import FileCell from "./FileCell";

const Tree: FunctionComponent<{
  entries: readonly Entry[];
  depth?: number;
}> = ({ entries, depth = 0 }) => {
  return (
    <div>
      {entries.map((entry) =>
        entry.type === EntryType.Directory ? (
          <DirectoryCell key={entry.name} entry={entry} depth={depth} />
        ) : (
          <FileCell key={entry.name} entry={entry} depth={depth} />
        )
      )}
    </div>
  );
};

export default Tree;
