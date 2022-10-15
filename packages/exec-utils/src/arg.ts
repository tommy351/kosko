function getArgName(name: string) {
  return `--${name}`;
}

/**
 * @public
 */
export function booleanArg(name: string, value?: boolean) {
  return value ? [getArgName(name)] : [];
}

/**
 * @public
 */
export function stringArg(name: string, value?: string) {
  return value ? [getArgName(name), value] : [];
}

/**
 * @public
 */
export function stringArrayArg(name: string, values: string[] = []) {
  return values.reduce(
    (acc, value) => [...acc, getArgName(name), value],
    [] as string[]
  );
}
