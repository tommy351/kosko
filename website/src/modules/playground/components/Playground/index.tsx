import React, { useEffect, useRef } from "react";
import Layout from "@theme/Layout";
import Provider from "./Provider";
import { Container, Section } from "react-simple-resizer";
import Bar from "../Bar";
import styles from "./styles.module.scss";
import Sidebar from "../Sidebar";
import Editor from "../Editor";
import Preview from "../Preview";

function Content() {
  return (
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
  );
}

export default function Playground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const parent = target.parentElement;
    if (!parent) return;

    parent.classList.add(styles.mainWrapper);

    return () => {
      parent.classList.remove(styles.mainWrapper);
    };
  }, [ref]);

  return (
    <Layout title="Playground">
      <Provider>
        <main className={styles.main} ref={ref}>
          {typeof window === "undefined" ? (
            <noscript>Please enable JavaScript to use the playground.</noscript>
          ) : (
            <Content />
          )}
        </main>
      </Provider>
    </Layout>
  );
}
