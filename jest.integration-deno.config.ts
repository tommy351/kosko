/* eslint-disable node/no-unpublished-import */
import type { Config } from "jest";

const config: Config = {
  projects: ["<rootDir>/packages/*/integration-deno"]
};

export default config;
