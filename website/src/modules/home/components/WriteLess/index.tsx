import React from "react";
import {
  Feature,
  FeatureDescription,
  FeatureExample,
  FeatureTitle
} from "../Feature";
import CodeBlock from "@site/src/modules/common/components/CodeBlock";
import styles from "./styles.module.scss";
import deployment from "!!raw-loader!./examples/deployment.yml";
import service from "!!raw-loader!./examples/service.yml";

export default function WriteLess() {
  return (
    <Feature id="write-less">
      <FeatureTitle>
        Write <strong>Less</strong>
      </FeatureTitle>
      <FeatureDescription>
        <p>
          Reuse variables, functions or any JavaScript libraries. Write
          Kubernetes manifests with less code. Eliminate duplicated YAML
          snippets here and there.
        </p>
      </FeatureDescription>
      <FeatureExample>
        <div className={styles.example}>
          <CodeBlock
            className={styles.topCodeBlock}
            language="javascript"
            code={`const labels = { app: "my-app" };`}
          />
          <CodeBlock
            className={styles.codeBlock}
            language="yaml"
            highlightLines={[5, 6, 9, 10]}
            code={deployment}
          />
          <CodeBlock
            className={styles.codeBlock}
            language="yaml"
            highlightLines={[6, 7]}
            code={service}
          />
        </div>
      </FeatureExample>
    </Feature>
  );
}
