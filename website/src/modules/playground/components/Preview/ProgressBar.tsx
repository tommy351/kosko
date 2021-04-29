import React, { FunctionComponent } from "react";
import styles from "./styles.module.scss";

const ProgressBar: FunctionComponent = () => {
  return (
    <div className={styles.progressBarContainer}>
      <div className={styles.progressBarBlock} />
    </div>
  );
};

export default ProgressBar;
