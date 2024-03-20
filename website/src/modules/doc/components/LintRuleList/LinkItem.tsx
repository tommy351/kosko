import type {
  PropSidebarItem,
  PropSidebarItemLink
} from "@docusaurus/plugin-content-docs";

export interface LinkItem extends PropSidebarItemLink {
  docId: string;
}

export function isLinkItem(item: PropSidebarItem): item is LinkItem {
  return item.type === "link" && typeof item.docId === "string";
}
