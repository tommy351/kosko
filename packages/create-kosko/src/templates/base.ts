export interface File {
  path: string;
  content: string;
}

export interface TemplateContext {
  path: string;
}

export interface TemplateResult {
  dependencies?: string[];
  devDependencies?: string[];
  files: File[];
}

export type Template = (ctx: TemplateContext) => Promise<TemplateResult>;
