export interface Component {
  readonly name: string;
  readonly text: string;
  readonly imports: readonly Import[];
}

export interface Import {
  readonly names: readonly string[];
  readonly path: string;
}

export enum MigrateFormat {
  CJS = "cjs",
  ESM = "esm"
}

export interface MigrateOptions {
  format?: MigrateFormat;
}
