import React from "react";
import CodeBlock, {
  defaultTokenRenderer,
  TokenRenderer
} from "@site/src/modules/common/components/CodeBlock";
import {
  Feature,
  FeatureDescription,
  FeatureExample,
  FeatureTitle
} from "../Feature";
import component from "!!raw-loader!./examples/component.js";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { VscError } from "react-icons/vsc";
import { usePrismTheme } from "@docusaurus/theme-common";

const tokenRenderer: TokenRenderer = (props) => {
  if (props.token.content === `"wrong_replicas"`) {
    return (
      <div className={styles.warningToken}>
        {defaultTokenRenderer(props)}
        <div className={styles.hintContainer}>
          <div
            className={clsx(styles.hintLine, styles.monospace)}
          >{`(property) IDeploymentSpec["replicas"]?: number`}</div>
          <div
            className={styles.hintLine}
          >{`Number of desired pods. This is a pointer to distinguish between explicit zero and not specified. Defaults to 1.`}</div>
        </div>
      </div>
    );
  }

  return defaultTokenRenderer(props);
};

function Problem({ detail, reason }: { reason: string; detail: string }) {
  return (
    <div className={styles.problem}>
      <div className={styles.problemIcon}>
        <VscError />
      </div>
      <div className={styles.problemDetail}>{detail}</div>
      <div className={styles.problemReason}>{reason}</div>
    </div>
  );
}

function Example() {
  const prismTheme = usePrismTheme();

  return (
    <FeatureExample>
      <div className={styles.codeBlockContainer}>
        <CodeBlock
          className={styles.codeBlock}
          language="javascript"
          code={component}
          hideLines={[1]}
          highlightLines={[7]}
          tokenRenderer={tokenRenderer}
        />
        <div className={styles.problemContainer} style={prismTheme.plain}>
          <Problem
            reason="ts(2322)"
            detail={`Type 'string' is not assignable to type 'number'.`}
          />
        </div>
      </div>
    </FeatureExample>
  );
}

export default function TypeSafe() {
  return (
    <Feature id="type-safe">
      <FeatureTitle>
        Type <strong>Safe</strong>
      </FeatureTitle>
      <FeatureDescription>
        <p>
          Kosko automatically validates manifests against Kubernetes OpenAPI
          schema, which helps you locate issues before applying to clusters.
        </p>
        <p>
          With TypeScript support, you can get type definitions, documentation,
          autocomplete suggestions and more right in your editors.
        </p>
      </FeatureDescription>
      <Example />
    </Feature>
  );
}
