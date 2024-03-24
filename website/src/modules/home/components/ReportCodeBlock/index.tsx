import React from "react";
import CodeBlock, {
  CodeBlockProps
} from "@site/src/modules/common/components/CodeBlock";
import styles from "./styles.module.scss";
import { usePrismTheme } from "@docusaurus/theme-common";
import { VscError } from "react-icons/vsc";

export interface IssueProps {
  reason: string;
  detail: string;
}

function Issue({ detail, reason }: IssueProps) {
  return (
    <div className={styles.issue}>
      <div className={styles.issueIcon}>
        <VscError />
      </div>
      <div className={styles.issueDetail}>{detail}</div>
      <div className={styles.issueReason}>{reason}</div>
    </div>
  );
}

export interface ReportCodeBlockProps
  extends Omit<CodeBlockProps, "className"> {
  issues: readonly IssueProps[];
}

export default function ReportCodeBlock({
  issues,
  ...props
}: ReportCodeBlockProps) {
  const prismTheme = usePrismTheme();

  return (
    <div className={styles.container}>
      <CodeBlock className={styles.codeBlock} {...props} />
      <div className={styles.issueContainer} style={prismTheme.plain}>
        {issues.map((issue, index) => (
          <Issue key={index} {...issue} />
        ))}
      </div>
    </div>
  );
}
