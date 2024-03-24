import React from "react";
import { useDoc } from "@docusaurus/theme-common/internal";
import BadgeList from "../LintRuleBadges";
import {
  includesDocId,
  useLintRulesMetadata
} from "../LintRuleList/useLintRulesMetadata";

function Content({ id }: { id: string }) {
  const metadata = useLintRulesMetadata();

  return (
    <BadgeList
      enabled={[
        ...(includesDocId(metadata.presets.recommended, id)
          ? (["recommended"] as const)
          : []),
        ...(includesDocId(metadata.validateAll, id) ? (["all"] as const) : [])
      ]}
    />
  );
}

export default function LintRuleBadges() {
  const doc = useDoc();

  if (!doc.metadata.id.startsWith("plugins/lint/rules/")) {
    return null;
  }

  return <Content id={doc.metadata.id} />;
}
