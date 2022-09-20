import React from "react";
import styles from "./styles.module.scss";
import { PreviewContextProvider } from "./context";
import { Section } from "react-simple-resizer";
import Bar from "../Bar";
import Container from "../Container";
import PreviewPane from "./PreviewPane";
import ErrorPane, { DEFAULT_SIZE } from "./ErrorPane";
import Executor from "./Executor";

export default function Preview() {
  return (
    <PreviewContextProvider>
      <Container vertical className={styles.container}>
        <Section minSize={40}>
          <PreviewPane />
        </Section>
        <Bar />
        <Section
          defaultSize={DEFAULT_SIZE}
          minSize={DEFAULT_SIZE}
          disableResponsive
        >
          <ErrorPane />
        </Section>
      </Container>
      <Executor />
    </PreviewContextProvider>
  );
}
