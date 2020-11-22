import React, { FunctionComponent } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";
import clsx from "clsx";

const features = [
  {
    title: "Manage Environments",
    image: "/img/undraw_environmental_study_skau.svg",
    content: (
      <p>
        Kosko can generate Kubernetes manifests for multiple environments, and
        share configs across manifests. No more copy and maintain multiple YAML
        files anymore.
      </p>
    )
  },
  {
    title: "Manifest Validation",
    image: "/img/undraw_Checklist__re_2w7v.svg",
    content: (
      <p>
        All manifests are validated against Kubernetes OpenAPI schema. You can
        also customize your own validator.
      </p>
    )
  },
  {
    title: "TypeScript Support",
    image: "/img/ts-logo-256.svg",
    content: (
      <p>
        Kosko supports TypeScript or any other languages that can be compiled to
        JavaScript. Now your manifests are type-safe, and have better
        autocompletion and documentation in IDE.
      </p>
    )
  },
  {
    title: "Reusability",
    image: "/img/undraw_Portfolio_update_re_jqnp.svg",
    content: (
      <p>
        Reuse variables and functions across manifests. Make use of the awesome
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
        <div className={clsx("container", styles.heroContainer)}>
          <h1 className={clsx("hero__title", styles.heroTitle)}>
            {siteConfig.title}
          </h1>
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
                  <div className={styles.feature}>
                    <img className={styles.featureImage} src={feature.image} />
                    <h2 className={styles.featureTitle}>{feature.title}</h2>
                    <p>{feature.content}</p>
                  </div>
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
