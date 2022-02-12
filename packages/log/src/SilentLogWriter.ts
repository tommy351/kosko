import { LogWriter } from "./types";

export class SilentLogWriter implements LogWriter {
  public write(): void {
    // do nothing
  }
}
