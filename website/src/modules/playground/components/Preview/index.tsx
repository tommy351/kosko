import React, { FunctionComponent } from "react";
import styles from "./styles.module.scss";
import { PreviewContextProvider } from "./context";
import { Container, Section } from "react-simple-resizer";
import Bar from "../Bar";
import PreviewPane from "./PreviewPane";
import ErrorPane from "./ErrorPane";
import Executor from "./Executor";

const Preview: FunctionComponent = () => {
  return (
    <PreviewContextProvider>
      <Container vertical className={styles.container}>
        <Section minSize={40}>
          <PreviewPane />
        </Section>
        <Bar vertical />
        <Section defaultSize={40} minSize={40} disableResponsive>
          <ErrorPane />
        </Section>
      </Container>
      <Executor />
    </PreviewContextProvider>
  );
};

export default Preview;
