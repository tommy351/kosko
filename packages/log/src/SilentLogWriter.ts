import { LogWriter } from "./types";

export default class SilentLogWriter implements LogWriter {
  public write(): void {
    // do nothing
  }
}
