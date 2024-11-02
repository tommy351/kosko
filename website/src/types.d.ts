/// <reference types="@types/webpack-env"/>
/// <reference types="docusaurus-plugin-sass"/>

declare module "!!raw-loader!*" {
  const content: string;
  export default content;
}

declare module "rollup/dist/rollup.browser" {
  export * from "rollup";
}
