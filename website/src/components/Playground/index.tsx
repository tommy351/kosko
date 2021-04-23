import React, { FunctionComponent } from "react";
import Layout from "@theme/Layout";
import { Container, Section, Bar } from "./Container";
import Sidebar from "./Sidebar";
import Editor from "./Editor";
import Preview from "./Preview";
import { PlaygroundProvider } from "./context";

const Playground: FunctionComponent = () => {
  return (
    <Layout title="Playground">
      <PlaygroundProvider>
        <Container>
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
      </PlaygroundProvider>
    </Layout>
  );
};

export default Playground;
