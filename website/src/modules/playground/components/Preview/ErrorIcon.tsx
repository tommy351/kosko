import React from "react";
import styles from "./styles.module.scss";
import { VscError } from "react-icons/vsc";

export default function ErrorIcon() {
  return (
    <div className={styles.errorIcon}>
      <VscError />
    </div>
  );
}
