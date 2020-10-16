const rTemplate = /#\{(\w+)\}/g;

export interface Paths {
  global: string;
  component: string;
}

/** @internal */
export function formatPath(path: string, data: Record<string, string>): string {
  return path.replace(rTemplate, (s, key) => {
    return data[key];
  });
}
