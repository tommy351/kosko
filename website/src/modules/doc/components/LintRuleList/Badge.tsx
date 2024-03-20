import React, { ReactNode } from "react";
import clsx from "clsx";

export default function Badge({
  color,
  children
}: {
  color: string;
  children: ReactNode;
}) {
  return <span className={clsx("badge", `badge--${color}`)}>{children}</span>;
}
