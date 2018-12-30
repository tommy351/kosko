import cleanStack from "clean-stack";

export function handleError(err: Error) {
  const code = 1;
  const msg = err.stack ? cleanStack(err.stack) : err.message;

  // tslint:disable-next-line:no-console
  console.error(msg);
  process.exit(code);
}
