import React, {
  FunctionComponent,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import styles from "./styles.module.scss";
import {
  Container as ResizerContainer,
  Bar as ResizerBar,
  Section as ResizerSection,
  ChildProps
} from "react-simple-resizer";
import cx from "clsx";

export const Container: FunctionComponent = ({ children }) => {
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
      <ResizerContainer className={styles.container}>
        {children}
      </ResizerContainer>
    </main>
  );
};

export const Section: FunctionComponent<Omit<ChildProps, "context">> = (
  props
) => {
  return <ResizerSection className={styles.section} {...props} />;
};

export const Bar: FunctionComponent = (props) => {
  const [active, setActive] = useState(false);

  return (
    <ResizerBar
      size={2}
      expandInteractiveArea={{ left: 2, right: 2 }}
      onStatusChanged={setActive}
      className={cx(styles.bar, {
        [styles.barActive]: active
      })}
      {...props}
    />
  );
};
