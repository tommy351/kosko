export interface Template<T> {
  description?: string;
  options?: { [P in keyof T]: Option<T[P]> };
  generate(options: T): Promise<Result>;
}

export interface Option<T> {
  type?: "string" | "boolean" | "number" | "array";
  default?: T | (() => T | undefined);
  description?: string;
  options?: string[];
  required?: boolean;
}

export interface Result {
  files: File[];
}

export interface File {
  /**
   * Destination path of a file.
   */
  path: string;

  /**
   * File content.
   */
  content: string;
}
