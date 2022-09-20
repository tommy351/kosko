import React, { ReactNode } from "react";
import clsx from "clsx";
import styles from "./styles.module.scss";

export function ToolbarContainer({
  children,
  onClick,
  className
}: {
  onClick?(): void;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={clsx(styles.container, className)} onClick={onClick}>
      {children}
    </div>
  );
}

export function ToolbarTitle({ children }: { children?: ReactNode }) {
  return <div className={styles.title}>{children}</div>;
}
