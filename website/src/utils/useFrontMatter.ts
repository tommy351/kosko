import { useDoc } from "@docusaurus/theme-common/internal";
import type { DocFrontMatter } from "@docusaurus/plugin-content-docs";

interface FrontMatter extends DocFrontMatter {
  available_since?: Record<string, string>;
  related?: string[];
}

export default function useFrontMatter() {
  const doc = useDoc();
  return doc.frontMatter as FrontMatter;
}
