import React from "react";
import styles from "./styles.module.scss";

export default function ProgressBar() {
  return (
    <div className={styles.progressBarContainer}>
      <div className={styles.progressBarBlock} />
    </div>
  );
}
