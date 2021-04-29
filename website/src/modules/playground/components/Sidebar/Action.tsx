import React, { FunctionComponent, ReactNode } from "react";
import styles from "./styles.module.scss";

export const ActionContainer: FunctionComponent = ({ children }) => {
  return <div>{children}</div>;
};

export const ActionButton: FunctionComponent<{
  title: string;
  onClick?(): void;
  icon: ReactNode;
}> = ({ icon, title, onClick }) => {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={styles.actionButton}
    >
      {icon}
    </button>
  );
};
