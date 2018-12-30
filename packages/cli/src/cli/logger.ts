import { Writable } from "stream";
import { format } from "util";

export class Logger {
  private readonly writer: Writable;

  constructor(writer: Writable) {
    this.writer = writer;
  }

  public log(msg: any, ...params: any[]) {
    this.writer.write(format(msg, ...params) + "\n");
  }
}
