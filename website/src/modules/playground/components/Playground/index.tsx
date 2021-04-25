import React, { FunctionComponent, useEffect, useRef } from "react";
import Layout from "@theme/Layout";
import Provider from "./Provider";
import { Container, Section } from "react-simple-resizer";
import Bar from "../Bar";
import styles from "./styles.module.scss";
import Sidebar from "../Sidebar";
import Editor from "../Editor";
import Preview from "../Preview";

const Playground: FunctionComponent = () => {
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
        <div className={styles.main} ref={ref}>
          <Container className={styles.container}>
            <Section defaultSize={160}>
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
    </Layout>
  );
};

export default Playground;
