import { LogWriter } from "./types";

/**
 * Omits logs.
 *
 * @public
 */
export default class SilentLogWriter implements LogWriter {
  public write(): void {
    // do nothing
  }
}
