import { isRecord } from "@kosko/utils";

const rTemplate = /#\{(\w+)\}/g;

/**
 * @public
 */
export interface Paths {
  global: string;
  component: string;
}

export function formatPath(path: string, data: Record<string, string>): string {
  return path.replace(rTemplate, (s, key: string) => {
    return (isRecord(data) && data[key]) || s;
  });
}
