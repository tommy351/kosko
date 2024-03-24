import React from "react";
import {
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
import ReportCodeBlock from "../ReportCodeBlock";

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
      {/* <Example /> */}
      <FeatureExample>
        <ReportCodeBlock
          language="javascript"
          code={component}
          hideLines={[1]}
          highlightLines={[7]}
          tokenRenderer={tokenRenderer}
          issues={[
            {
              reason: "ts(2322)",
              detail: `Type 'string' is not assignable to type 'number'.`
            }
          ]}
        />
      </FeatureExample>
    </Feature>
  );
}
