function getArgName(name: string) {
  return `--${name}`;
}

export function booleanArg(name: string, value?: boolean) {
  return value ? [getArgName(name)] : [];
}

export function stringArg(name: string, value?: string) {
  return value ? [getArgName(name), value] : [];
}

export function stringArrayArg(name: string, values: string[] = []) {
  return values.reduce(
    (acc, value) => [...acc, getArgName(name), value],
    [] as string[]
  );
}
