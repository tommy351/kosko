import React, { FunctionComponent } from "react";
import styles from "./styles.module.scss";
import { VscWarning } from "react-icons/vsc";

const WarningIcon: FunctionComponent = () => {
  return (
    <div className={styles.warningIcon}>
      <VscWarning />
    </div>
  );
};

export default WarningIcon;
