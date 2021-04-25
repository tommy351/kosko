import React, { FunctionComponent, ReactNode } from "react";
import clsx from "clsx";
import styles from "./styles.module.scss";
import { Entry } from "./types";

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

export default Cell;
