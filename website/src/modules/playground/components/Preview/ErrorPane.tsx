import React, { ReactNode, useMemo } from "react";
import styles from "./styles.module.scss";
import { ToolbarContainer, ToolbarTitle } from "../Toolbar";
import { usePreviewContext } from "./context";
import ErrorIcon from "./ErrorIcon";
import WarningIcon from "./WarningIcon";
import { serializeError } from "serialize-error";
import { useContainer } from "../Container";

export const DEFAULT_SIZE = 40;
export const EXPANDED_SIZE = 200;

function Summary({ icon, value }: { icon: ReactNode; value: number }) {
  if (!value) return null;

  return (
    <div className={styles.errorPaneSummaryContainer}>
      {icon}
      <div className={styles.errorPaneSummaryValue}>{value}</div>
    </div>
  );
}

function Cell({
  icon,
  message,
  detail
}: {
  icon: ReactNode;
  message: ReactNode;
  detail?: ReactNode;
}) {
  return (
    <details className={styles.errorPaneCellContainer}>
      <summary className={styles.errorPaneCellSummary}>
        <div className={styles.errorPaneCellIcon}>{icon}</div>
        <div className={styles.errorPaneCellMessage}>{message}</div>
      </summary>
      {detail && <div className={styles.errorPaneCellDetail}>{detail}</div>}
    </details>
  );
}

function ErrorCell({ error }: { error: any }) {
  const {
    name = "Error",
    message = "",
    stack
  } = useMemo(() => serializeError(error), [error]);

  return (
    <Cell
      icon={<ErrorIcon />}
      message={`${name}: ${message}`}
      detail={stack && <pre>{stack}</pre>}
    />
  );
}

export default function ErrorPane() {
  const {
    value: { errors, warnings }
  } = usePreviewContext();
  const { ref: containerRef } = useContainer();

  return (
    <div className={styles.pane}>
      <ToolbarContainer
        className={styles.errorPaneToolbar}
        onClick={() => {
          const container = containerRef.current;
          const resizer = container.getResizer();
          const toSize =
            resizer.getSectionSize(1) <= DEFAULT_SIZE
              ? EXPANDED_SIZE
              : DEFAULT_SIZE;

          resizer.resizeSection(1, { toSize });
          container.applyResizer(resizer);
        }}
      >
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
}
