import React from "react";
import { Entry, EntryType } from "./types";
import DirectoryCell from "./DirectoryCell";
import FileCell from "./FileCell";

export default function Tree({
  entries,
  depth = 0
}: {
  entries: readonly Entry[];
  depth?: number;
}) {
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
}
