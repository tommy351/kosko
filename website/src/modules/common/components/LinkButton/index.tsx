import React, { FunctionComponent } from "react";
import Link from "@docusaurus/Link";
import clsx from "clsx";

type ButtonColor =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "link";

type ButtonSize = "sm" | "lg";

type LinkButtonProps = {
  to?: string;
  className?: string;
  activeClassName?: string;
  isNavLink?: boolean;
  color?: ButtonColor;
  size?: ButtonSize;
  outline?: boolean;
  active?: boolean;
  disabled?: boolean;
  block?: boolean;
};

const LinkButton: FunctionComponent<LinkButtonProps> = ({
  className,
  color,
  size,
  outline,
  active,
  disabled,
  block,
  ...props
}) => {
  return (
    <Link
      {...props}
      className={clsx(
        "button",
        {
          [`button--${color}`]: color,
          [`button--${size}`]: size,
          "button--outline": outline,
          "button--active": active,
          disabled: disabled,
          "button--block": block
        },
        className
      )}
    />
  );
};

export default LinkButton;
