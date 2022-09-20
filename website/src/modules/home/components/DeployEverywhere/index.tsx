import React, { useState } from "react";
import {
  Feature,
  FeatureDescription,
  FeatureExample,
  FeatureTitle
} from "../Feature";
import styles from "./styles.module.scss";
import clsx from "clsx";
import componentNginx from "!!raw-loader!./examples/components/nginx.js";
import environmentProd from "!!raw-loader!./examples/environments/prod.js";
import environmentStage from "!!raw-loader!./examples/environments/stage.js";
import resultProd from "!!raw-loader!./examples/results/prod.yml";
import resultStage from "!!raw-loader!./examples/results/stage.yml";
import CodeBlock, {
  CodeBlockProps
} from "@site/src/modules/common/components/CodeBlock";
import { usePrismTheme } from "@docusaurus/theme-common";

function Pane({ tabs }: { tabs: Record<string, CodeBlockProps> }) {
  const [active, setActive] = useState(Object.keys(tabs)[0]);

  return (
    <div className={styles.pane}>
      <div className={styles.tabs}>
        {Object.keys(tabs).map((key) => (
          <button
            key={key}
            className={clsx(styles.tab, {
              [styles.tabActive]: active === key
            })}
            onClick={() => setActive(key)}
          >
            {key}
          </button>
        ))}
      </div>
      <CodeBlock {...tabs[active]} className={styles.paneCode} />
    </div>
  );
}

function CodePane() {
  return (
    <Pane
      tabs={{
        "nginx.js": {
          language: "javascript",
          code: componentNginx,
          hideLines: [1]
        },
        "prod.js": {
          language: "javascript",
          code: environmentProd
        },
        "stage.js": {
          language: "javascript",
          code: environmentStage
        }
      }}
    />
  );
}

function ResultPane() {
  return (
    <Pane
      tabs={{
        Prod: {
          language: "yaml",
          code: resultProd
        },
        Stage: {
          language: "yaml",
          code: resultStage
        }
      }}
    />
  );
}

function Example() {
  const prismTheme = usePrismTheme();

  return (
    <FeatureExample>
      <div className={styles.codeWindow} style={prismTheme.plain}>
        <div className={styles.panes}>
          <CodePane />
          <ResultPane />
        </div>
      </div>
    </FeatureExample>
  );
}

export default function DeployEverywhere() {
  return (
    <Feature id="deploy-everywhere">
      <FeatureTitle>
        Deploy <strong>Everywhere</strong>
      </FeatureTitle>
      <FeatureDescription>
        <p>
          Stop copy and paste when deploying to a new Kubernetes cluster. In
          Kosko, manifests are split into components and environments. It&apos;s
          faster to create a new environment file than copy and modify existing
          YAML files.
        </p>
      </FeatureDescription>
      <Example />
    </Feature>
  );
}
