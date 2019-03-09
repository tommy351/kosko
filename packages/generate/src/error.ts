export class ValidationError extends Error {
  public readonly name = "ValidationError";

  public constructor(
    public readonly path: string,
    public readonly index: number,
    public readonly cause: Error
  ) {
    super(`${cause.message} (path: ${path}, index: ${index})`);

    // Regular expression is from: https://github.com/sindresorhus/extract-stack
    const stack = cause.stack || this.stack;
    if (!stack) return;

    const pos = stack.search(/(?:\n {4}at .*)+/);

    this.stack = `${this.name}: ${
      cause.message
    }\nPath: ${path}\nIndex: ${index}${
      ~pos ? stack.substring(pos) : "\n" + stack
    }`;
  }
}
