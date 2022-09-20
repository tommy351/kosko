import React, { ReactNode } from "react";
import styles from "./styles.module.scss";

export function Feature({
  children,
  id
}: {
  id?: string;
  children?: ReactNode;
}) {
  return (
    <section id={id} className={styles.wrapper}>
      <div className="container">{children}</div>
    </section>
  );
}

export function FeatureDescription({ children }: { children?: ReactNode }) {
  return <div className={styles.description}>{children}</div>;
}

export function FeatureTitle({ children }: { children?: ReactNode }) {
  return <h2 className={styles.title}>{children}</h2>;
}

export function FeatureExample({ children }: { children?: ReactNode }) {
  return <div className={styles.example}>{children}</div>;
}
