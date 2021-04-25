import React, { FunctionComponent } from "react";
import clsx from "clsx";
import styles from "./styles.module.scss";
import useBaseUrl from "@docusaurus/useBaseUrl";
import LinkButton from "@site/src/modules/common/components/LinkButton";

const Header: FunctionComponent = () => {
  return (
    <header className={clsx("container", styles.container)}>
      <h1 className={styles.title}>
        Organize <strong>Kubernetes</strong> manifests in{" "}
        <strong>JavaScript</strong>.
      </h1>
      <div className={styles.actions}>
        <LinkButton color="primary" size="lg" to={useBaseUrl("docs/")}>
          Get Started
        </LinkButton>
        <div className={styles.install}>npm install kosko -g</div>
      </div>
    </header>
  );
};

export default Header;
