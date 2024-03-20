import React from "react";
import RecommendedBadge from "./RecommendedBadge";
import styles from "./styles.module.scss";
import clsx from "clsx";
import AllBadge from "./AllBadge";

const BADGES = [
  {
    badge: <RecommendedBadge />,
    description: "Enabled in recommended preset."
  },
  {
    badge: <AllBadge />,
    description: "Disabled when components are given in CLI."
  }
];

export default function BadgeList() {
  return (
    <div className={clsx("padding-bottom--md", styles.badgeList)}>
      {BADGES.map((badge, index) => (
        <div
          key={index}
          className={clsx(
            "padding-right--lg",
            "padding-bottom--md",
            styles.badgeListItem
          )}
        >
          <div>{badge.badge}</div>
          <span className="padding-left--sm">{badge.description}</span>
        </div>
      ))}
    </div>
  );
}
