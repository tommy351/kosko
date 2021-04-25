import React, { FunctionComponent, ReactNode, useMemo } from "react";
import styles from "./styles.module.scss";
import { ToolbarContainer, ToolbarTitle } from "../Toolbar";
import { usePreviewContext } from "./context";
import ErrorIcon from "./ErrorIcon";
import WarningIcon from "./WarningIcon";
import { serializeError } from "serialize-error";

const Summary: FunctionComponent<{
  icon: ReactNode;
  value: number;
}> = ({ icon, value }) => {
  if (!value) return null;

  return (
    <div className={styles.errorPaneSummaryContainer}>
      {icon}
      <div className={styles.errorPaneSummaryValue}>{value}</div>
    </div>
  );
};

const Cell: FunctionComponent<{
  icon: ReactNode;
  message: ReactNode;
  detail?: ReactNode;
}> = ({ icon, message, detail }) => {
  return (
    <details className={styles.errorPaneCellContainer}>
      <summary className={styles.errorPaneCellSummary}>
        <div className={styles.errorPaneCellIcon}>{icon}</div>
        <div className={styles.errorPaneCellMessage}>{message}</div>
      </summary>
      {detail && <div className={styles.errorPaneCellDetail}>{detail}</div>}
    </details>
  );
};

const ErrorCell: FunctionComponent<{ error: any }> = ({ error }) => {
  const { name = "Error", message = "", stack } = useMemo(
    () => serializeError(error),
    [error]
  );

  return (
    <Cell
      icon={<ErrorIcon />}
      message={`${name}: ${message}`}
      detail={stack && <pre>{stack}</pre>}
    />
  );
};

const ErrorPane: FunctionComponent = () => {
  const {
    value: { errors, warnings }
  } = usePreviewContext();

  return (
    <div className={styles.pane}>
      <ToolbarContainer>
        <ToolbarTitle>Errors</ToolbarTitle>
        <Summary icon={<ErrorIcon />} value={errors.length} />
        <Summary icon={<WarningIcon />} value={warnings.length} />
      </ToolbarContainer>
      <div className={styles.errorPaneList}>
        {errors.map((err, i) => (
          <ErrorCell key={i} error={err} />
        ))}
        {warnings.map((warning, i) => (
          <Cell key={i} icon={<WarningIcon />} message={warning} />
        ))}
      </div>
    </div>
  );
};

export default ErrorPane;
