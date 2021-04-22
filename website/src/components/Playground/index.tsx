import React, { FunctionComponent } from "react";
import Layout from "@theme/Layout";
import Container from "./Container";
import Toolbar from "./Toolbar";
import Sidebar from "./Sidebar";
import Editor from "./Editor";
import Preview from "./Preview";
import { PlaygroundProvider } from "./context";
import styles from "./styles.module.scss";

const Playground: FunctionComponent = () => {
  return (
    <Layout title="Playground">
      <PlaygroundProvider>
        <Container>
          <Toolbar />
          <div className={styles.main}>
            <Sidebar />
            <Editor />
            <Preview />
          </div>
        </Container>
      </PlaygroundProvider>
    </Layout>
  );
};

export default Playground;
