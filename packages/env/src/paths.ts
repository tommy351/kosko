const rTemplate = /#\{(\w+)\}/g;

export interface Paths {
  global: string;
  component: string;
}

export function formatPath(path: string, data: any): string {
  return path.replace(rTemplate, (s, key) => {
    return data[key];
  });
}
