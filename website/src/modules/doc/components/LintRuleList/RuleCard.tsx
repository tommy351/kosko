import React, { ReactNode } from "react";
import { useDocById } from "@docusaurus/theme-common/internal";
import styles from "./styles.module.scss";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import RecommendedBadge from "../RecommendedBadge";
import { LinkItem } from "./LinkItem";
import AllBadge from "../AllBadge";
import { includesDocId, useLintRulesMetadata } from "./useLintRulesMetadata";

function BadgeContainer({ children }: { children: ReactNode }) {
  return (
    <div className={clsx("padding-left--sm", styles.cardBadgeContainer)}>
      {children}
    </div>
  );
}

export default function RuleCard({ item }: { item: LinkItem }) {
  const doc = useDocById(item.docId);
  const metadata = useLintRulesMetadata();

  return (
    <Link className={clsx("card", styles.cardContainer)} to={item.href}>
      <div className={clsx("card__body", styles.cardBody)}>
        <div className={clsx("padding-right--lg", styles.cardLeft)}>
          <h3 className={clsx(styles.cardTitle)}>{doc.title}</h3>
          <p className={styles.cardDescription}>{doc.description}</p>
        </div>
        <div className={styles.cardRight}>
          {includesDocId(metadata.presets.recommended, item.docId) && (
            <BadgeContainer>
              <RecommendedBadge />
            </BadgeContainer>
          )}
          {includesDocId(metadata.validateAll, item.docId) && (
            <BadgeContainer>
              <AllBadge />
            </BadgeContainer>
          )}
        </div>
      </div>
    </Link>
  );
}
