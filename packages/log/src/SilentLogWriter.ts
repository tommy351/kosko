import { LogWriter } from "./types";

/**
 * @public
 */
export default class SilentLogWriter implements LogWriter {
  public write(): void {
    // do nothing
  }
}
