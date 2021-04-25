import React, { FunctionComponent } from "react";
import styles from "./styles.module.scss";
import { VscError } from "react-icons/vsc";

const ErrorIcon: FunctionComponent = () => {
  return (
    <div className={styles.errorIcon}>
      <VscError />
    </div>
  );
};

export default ErrorIcon;
