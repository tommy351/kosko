import React, { FunctionComponent } from "react";
import styles from "./styles.module.scss";

export const ToolbarContainer: FunctionComponent = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export const ToolbarTitle: FunctionComponent = ({ children }) => {
  return <div className={styles.title}>{children}</div>;
};
