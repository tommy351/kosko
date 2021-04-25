import React, { FunctionComponent, ReactNode } from "react";
import clsx from "clsx";
import usePlaygroundContext from "../../hooks/usePlaygroundContext";
import styles from "./styles.module.scss";
import { Directory, File, Entry, EntryType } from "./generateEntries";
import { FcFolder, FcFile } from "react-icons/fc";

const Cell: FunctionComponent<{
  entry: Entry;
  icon: ReactNode;
  depth: number;
  onClick?(): void;
  className?: string;
}> = ({ children, entry, icon, depth, onClick, className }) => {
  return (
    <div>
      <button
        className={clsx(styles.cellButton, className)}
        style={{ paddingLeft: `${(depth + 1) * 0.75}rem` }}
        onClick={onClick}
      >
        <div className={styles.cellIcon}>{icon}</div>
        <div className={styles.cellLabel}>{entry.name}</div>
      </button>
      {children}
    </div>
  );
};

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

const DirectoryCell: FunctionComponent<{ entry: Directory; depth: number }> = ({
  entry,
  depth
}) => {
  return (
    <Cell entry={entry} icon={<FcFolder />} depth={depth}>
      <Tree entries={entry.children} depth={depth + 1} />
    </Cell>
  );
};

const Tree: FunctionComponent<{
  entries: readonly Entry[];
  depth?: number;
}> = ({ entries, depth = 0 }) => {
  return (
    <div>
      {entries.map((entry) => (
        <React.Fragment key={entry.name}>
          {entry.type === EntryType.Directory ? (
            <DirectoryCell entry={entry} depth={depth} />
          ) : (
            <FileCell entry={entry} depth={depth} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Tree;
