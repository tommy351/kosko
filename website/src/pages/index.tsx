import React, { FunctionComponent } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

const features = [
  {
    title: "Multiple Environments",
    content: (
      <p>
        Kosko can generate Kubernetes manifests for multiple environments. No
        more copy and maintain multiple YAML files anymore.
      </p>
    )
  },
  {
    title: "Validation",
    content: (
      <p>
        All components are validated against Kubernetes OpenAPI schema. You can
        also customize your own validator.
      </p>
    )
  },
  {
    title: "TypeScript Support",
    content: (
      <p>
        TypeScript and any languages compiled to JavaScript are supported. It
        makes your manifests type-safe.
      </p>
    )
  },
  {
    title: "Reusability",
    content: (
      <p>
        Reuse variables and functions across components. Make use of the awesome
        Node.js ecosystem.
      </p>
    )
  }
];

const Home: FunctionComponent = () => {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout>
      <header className="hero hero--primary">
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div>
            <Link
              className="button button--secondary button--lg"
              to={useBaseUrl("docs/")}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              {features.map((feature, i) => (
                <div key={i} className="col col--6">
                  <h3>{feature.title}</h3>
                  <p>{feature.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Home;
