import React, { FunctionComponent, useLayoutEffect, useRef } from "react";
import styles from "./styles.module.scss";

const Container: FunctionComponent = ({ children }) => {
  const ref = useRef<HTMLDivElement>();

  useLayoutEffect(() => {
    if (!ref.current) return;

    ref.current.parentElement.classList.add(styles.wrapper);

    return () => {
      ref.current.parentElement.classList.remove(styles.wrapper);
    };
  }, [ref]);

  return (
    <main ref={ref} className={styles.main}>
      {children}
    </main>
  );
};

export default Container;
