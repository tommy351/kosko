import React from "react";
import {
  Feature,
  FeatureDescription,
  FeatureExample,
  FeatureTitle
} from "../Feature";
import ReportCodeBlock from "../ReportCodeBlock";
import component from "!!raw-loader!./examples/component.js";

export default function FindIssues() {
  return (
    <Feature id="find-issues">
      <FeatureTitle>
        Find <strong>Issues</strong>
      </FeatureTitle>
      <FeatureDescription>
        <p>
          Besides checking if a field should be a number or a string, Kosko can
          find issues such as missing namespaces, invalid pod selectors, require
          container probes, and much more!
        </p>
      </FeatureDescription>
      <FeatureExample>
        <ReportCodeBlock
          language="javascript"
          code={component}
          hideLines={[1]}
          highlightLines={[7, 9]}
          issues={[
            {
              reason: "valid-pod-selector",
              detail: "Pod selector must match template labels."
            }
          ]}
        />
      </FeatureExample>
    </Feature>
  );
}
