/// <reference types="@types/webpack-env"/>

declare module "*.module.scss" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "!!raw-loader!*" {
  const content: string;
  export default content;
}

declare module "rollup/dist/rollup.browser" {
  export * from "rollup";
}
