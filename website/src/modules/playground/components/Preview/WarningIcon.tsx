import React from "react";
import styles from "./styles.module.scss";
import { VscWarning } from "react-icons/vsc";

export default function WarningIcon() {
  return (
    <div className={styles.warningIcon}>
      <VscWarning />
    </div>
  );
}
