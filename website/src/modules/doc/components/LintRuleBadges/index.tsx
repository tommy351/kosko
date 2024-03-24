import RecommendedBadge from "../RecommendedBadge";
import styles from "./styles.module.scss";
import clsx from "clsx";
import AllBadge from "../AllBadge";

const BADGES = {
  recommended: {
    badge: <RecommendedBadge />,
    description: "Enabled in recommended preset."
  },
  all: {
    badge: <AllBadge />,
    description: "Disabled when components are given in CLI."
  }
};

export default function LintRuleBadges({
  enabled
}: {
  enabled?: (keyof typeof BADGES)[];
}) {
  const entries = Object.entries(BADGES);
  const badges = enabled
    ? entries.filter(([key]) => (enabled as string[]).includes(key))
    : entries;

  if (!badges.length) return null;

  return (
    <div className={clsx("padding-bottom--md", styles.list)}>
      {badges.map(([key, badge]) => (
        <div
          key={key}
          className={clsx(
            "padding-right--lg",
            "padding-bottom--md",
            styles.item
          )}
        >
          <div>{badge.badge}</div>
          <span className="padding-left--sm">{badge.description}</span>
        </div>
      ))}
    </div>
  );
}
