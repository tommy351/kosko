import React, { useMemo } from "react";
import { useCurrentSidebarCategory } from "@docusaurus/theme-common";
import clsx from "clsx";
import LintRuleBadges from "../LintRuleBadges";
import { isLinkItem } from "./LinkItem";
import RuleCard from "./RuleCard";

export default function LintRuleList() {
  const category = useCurrentSidebarCategory();
  const links = useMemo(() => category.items.filter(isLinkItem), [category]);

  return (
    <div>
      <LintRuleBadges />
      {links.map((item, index) => (
        <div key={item.docId} className={clsx({ "padding-top--md": index })}>
          <RuleCard item={item} />
        </div>
      ))}
    </div>
  );
}
