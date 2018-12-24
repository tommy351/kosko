import { Logger } from "./utils/log";

export const COMPONENT_DIR = "components";
export const ENVIRONMENT_DIR = "environments";

export interface Context {
  cwd: string;
  logger: Logger;
}
