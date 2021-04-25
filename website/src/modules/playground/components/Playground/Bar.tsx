import React, { FunctionComponent, useState } from "react";
import { Bar as ResizerBar } from "react-simple-resizer";
import clsx from "clsx";
import styles from "./styles.module.scss";

const Bar: FunctionComponent = (props) => {
  const [active, setActive] = useState(false);

  return (
    <ResizerBar
      size={2}
      expandInteractiveArea={{ left: 2, right: 2 }}
      onStatusChanged={setActive}
      className={clsx(styles.bar, {
        [styles.barActive]: active
      })}
      {...props}
    />
  );
};

export default Bar;
