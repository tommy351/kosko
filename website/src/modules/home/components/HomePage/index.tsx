import React, { FunctionComponent } from "react";
import Layout from "@theme/Layout";
import Header from "../Header";
import WriteLess from "../WriteLess";
import DeployEverywhere from "../DeployEverywhere";
import TypeSafe from "../TypeSafe";

const HomePage: FunctionComponent = () => {
  return (
    <Layout title="Organize Kubernetes manifests in JavaScript">
      <Header />
      <main>
        <WriteLess />
        <DeployEverywhere />
        <TypeSafe />
      </main>
    </Layout>
  );
};

export default HomePage;
