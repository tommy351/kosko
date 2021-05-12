export interface Stats {
  isFile: boolean;
  isDirectory: boolean;
  isSymbolicLink: boolean;
  size: number;
}

export class NotFoundError extends Error {
  public constructor(message = "No such file or directory") {
    super(message);
  }
}
