import { useDoc } from "@docusaurus/plugin-content-docs/client";
import type { DocFrontMatter } from "@docusaurus/plugin-content-docs";

interface FrontMatter extends DocFrontMatter {
  available_since?: Record<string, string>;
}

export default function useFrontMatter() {
  const doc = useDoc();
  return doc.frontMatter as FrontMatter;
}
