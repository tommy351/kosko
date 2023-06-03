import { Writer } from "@kosko/generate";
import { Writable } from "node:stream";

export class BufferWriter implements Writer {
  private readonly chunks: string[] = [];

  public write(data: string) {
    this.chunks.push(data);
  }

  public pipe(target: Writable): void {
    for (const chunk of this.chunks) {
      target.write(chunk);
    }
  }
}
