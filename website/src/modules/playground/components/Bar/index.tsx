import React, { FunctionComponent, useMemo, useState } from "react";
import { Bar as ResizerBar } from "react-simple-resizer";
import clsx from "clsx";
import styles from "./styles.module.scss";
import { useContainer } from "../Container";

const EXPAND_SIZE = 2;

const Bar: FunctionComponent = (props) => {
  const [active, setActive] = useState(false);
  const { vertical } = useContainer();
  const expandInteractiveArea = useMemo(
    () =>
      vertical
        ? { top: EXPAND_SIZE, bottom: EXPAND_SIZE }
        : { left: EXPAND_SIZE, right: EXPAND_SIZE },
    [vertical]
  );

  return (
    <ResizerBar
      size={2}
      expandInteractiveArea={expandInteractiveArea}
      onStatusChanged={setActive}
      className={clsx(styles.bar, {
        [styles.barActive]: active
      })}
      {...props}
    />
  );
};

export default Bar;
