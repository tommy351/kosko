import React, { ReactNode } from "react";
import clsx from "clsx";
import styles from "./styles.module.scss";
import { Entry } from "./types";

export default function Cell({
  children,
  entry,
  icon,
  depth,
  onClick,
  action,
  active
}: {
  entry: Entry;
  icon: ReactNode;
  depth: number;
  onClick?(): void;
  action?: ReactNode;
  active?: boolean;
  children?: ReactNode;
}) {
  return (
    <div>
      <div
        className={clsx(styles.cellMain, {
          [styles.cellMainActive]: active
        })}
      >
        <button
          type="button"
          className={styles.cellButton}
          style={{ paddingLeft: `${(depth + 1) * 0.75}rem` }}
          onClick={onClick}
        >
          <div className={styles.cellIcon}>{icon}</div>
          <div className={styles.cellLabel}>{entry.name}</div>
        </button>
        {action && <div className={styles.cellAction}>{action}</div>}
      </div>
      {children}
    </div>
  );
}
