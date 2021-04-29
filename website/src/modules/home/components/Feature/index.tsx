import React, { FunctionComponent } from "react";
import styles from "./styles.module.scss";

export const Feature: FunctionComponent<{ id?: string }> = ({
  children,
  id
}) => {
  return (
    <section id={id} className={styles.wrapper}>
      <div className="container">{children}</div>
    </section>
  );
};

export const FeatureDescription: FunctionComponent = ({ children }) => {
  return <div className={styles.description}>{children}</div>;
};

export const FeatureTitle: FunctionComponent = ({ children }) => {
  return <h2 className={styles.title}>{children}</h2>;
};

export const FeatureExample: FunctionComponent = ({ children }) => {
  return <div className={styles.example}>{children}</div>;
};
