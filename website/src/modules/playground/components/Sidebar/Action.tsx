import React, { ReactNode } from "react";
import styles from "./styles.module.scss";

export function ActionContainer({ children }: { children?: ReactNode }) {
  return <div>{children}</div>;
}

export function ActionButton({
  icon,
  title,
  onClick
}: {
  title: string;
  onClick?(): void;
  icon: ReactNode;
}) {
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
}
