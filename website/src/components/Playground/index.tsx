import React, { FunctionComponent } from "react";
import Layout from "@theme/Layout";
import Container from "./Container";
import Toolbar from "./Toolbar";
import Sidebar from "./Sidebar";
import Editor from "./Editor";
import Preview from "./Preview";
import { PlaygroundProvider } from "./context";
import styles from "./styles.module.scss";
import useRollup from "./hooks/useRollup";

const Content: FunctionComponent = () => {
  return (
    <Container>
      <Toolbar />
      <div className={styles.main}>
        <Sidebar />
        <Editor />
        <Preview />
      </div>
    </Container>
  );
};

const Playground: FunctionComponent = () => {
  // Load rollup before loading other components in order to make sure
  // rollup will be injected into `window.rollup`. Because monaco may set
  // `window.require` which makes rollup feels it is a CommonJS environment.
  const rollup = useRollup();

  return (
    <Layout title="Playground">
      <PlaygroundProvider>{rollup && <Content />}</PlaygroundProvider>
    </Layout>
  );
};

export default Playground;
