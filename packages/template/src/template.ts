export interface Template<T> {
  description?: string;
  options?: { [P in keyof T]: Option<T[P]> };
  generate(options: T): Promise<Result>;
}

export interface Option<T> {
  type?: "string" | "boolean" | "number";
  default?: T | (() => T | undefined);
  description?: string;
  multiple?: boolean;
  options?: string[];
  required?: boolean;
  parse?(input: string): T;
}

export interface Result {
  files: File[];
}

export interface File {
  path: string;
  content: string;
}
