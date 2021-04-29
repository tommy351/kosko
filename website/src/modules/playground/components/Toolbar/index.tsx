import React, { FunctionComponent } from "react";
import clsx from "clsx";
import styles from "./styles.module.scss";

export const ToolbarContainer: FunctionComponent<{
  onClick?(): void;
  className?: string;
}> = ({ children, onClick, className }) => {
  return (
    <div className={clsx(styles.container, className)} onClick={onClick}>
      {children}
    </div>
  );
};

export const ToolbarTitle: FunctionComponent = ({ children }) => {
  return <div className={styles.title}>{children}</div>;
};
