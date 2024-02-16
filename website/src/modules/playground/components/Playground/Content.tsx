import React, { useEffect, useRef } from "react";
import Provider from "./Provider";
import { Container, Section } from "react-simple-resizer";
import Bar from "../Bar";
import styles from "./styles.module.scss";
import Sidebar from "../Sidebar";
import Editor from "../Editor";
import Preview from "../Preview";

export function Content() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parent = ref.current?.parentElement?.parentElement;
    if (!parent) return;

    parent.classList.add(styles.mainWrapper);

    return () => {
      parent.classList.remove(styles.mainWrapper);
    };
  }, [ref]);

  return (
    <Provider>
      <div className={styles.containerWrapper} ref={ref}>
        <Container className={styles.container}>
          <Section defaultSize={200}>
            <Sidebar />
          </Section>
          <Bar />
          <Section>
            <Editor />
          </Section>
          <Bar />
          <Section>
            <Preview />
          </Section>
        </Container>
      </div>
    </Provider>
  );
}
