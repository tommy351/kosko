import React from "react";
import Layout from "@theme/Layout";
import Header from "../Header";
import WriteLess from "../WriteLess";
import DeployEverywhere from "../DeployEverywhere";
import TypeSafe from "../TypeSafe";

export default function HomePage() {
  return (
    <Layout description="Organize Kubernetes manifests in JavaScript.">
      <Header />
      <main>
        <WriteLess />
        <DeployEverywhere />
        <TypeSafe />
      </main>
    </Layout>
  );
}
