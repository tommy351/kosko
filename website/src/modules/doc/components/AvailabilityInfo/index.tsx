import React from "react";
import Admonition from "@theme/Admonition";

export default function AvailabilityInfo({
  availability
}: {
  availability: Record<string, string>;
}) {
  return (
    <Admonition type="info" title="Available since">
      <ul>
        {Object.entries(availability).map(([pkg, version]) => (
          <li key={pkg}>
            {pkg} v{version}
          </li>
        ))}
      </ul>
    </Admonition>
  );
}
