export interface File {
  path: string;
  content: string;
}

export interface TemplateContext {
  path: string;
}

export type Template = (ctx: TemplateContext) => Promise<File[]>;
