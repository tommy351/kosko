import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import globby from "globby";
import { basename, dirname, extname, join } from "node:path";
import { EOL } from "node:os";
import { dump } from "js-yaml";

const WEBSITE_ROOT = join(__dirname, "..");
const DEST_DIR = join(WEBSITE_ROOT, "docs/api");

interface SidebarItemDoc {
  type: "doc";
  id: string;
  label?: string;
}

interface SidebarItemCategory {
  type: "category";
  label: string;
  link: SidebarItemDoc;
  items: SidebarItem[];
}

type SidebarItem = SidebarItemDoc | SidebarItemCategory;

function getSidebarItemId(item: SidebarItem): string {
  switch (item.type) {
    case "doc":
      return item.id;

    case "category":
      return item.link.id;
  }
}

interface Breadcrumb {
  id: string;
  title: string;
}

function parseBreadcrumb(input: string) {
  const breadcrumbs: Breadcrumb[] = [];

  for (const match of input.matchAll(/\[([^\]]+)\]\(([^)]+?)\)/g)) {
    breadcrumbs.push({
      id: "api/" + basename(match[2], extname(match[2])),
      title: match[1].replace(/\\/g, "")
    });
  }

  return breadcrumbs;
}

function findSidebarItemById(items: SidebarItem[], id: string) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (getSidebarItemId(item) === id) {
      return { index: i, item };
    }
  }
}

function createSidebarItemCategory(
  breadcrumb: Breadcrumb
): SidebarItemCategory {
  return {
    type: "category",
    label: breadcrumb.title,
    link: {
      type: "doc",
      id: breadcrumb.id
    },
    items: []
  };
}

function insertToSidebar(items: SidebarItem[], breadcrumbs: Breadcrumb[]) {
  const [head, ...rest] = breadcrumbs;
  const existingItem = findSidebarItemById(items, head.id);

  // When rest is empty, it means this is the end of breadcrumbs
  if (!rest.length) {
    if (existingItem) {
      existingItem.item.label = head.title;
    } else {
      items.push({
        type: "doc",
        id: head.id,
        label: head.title
      });
    }

    return;
  }

  let category: SidebarItemCategory;

  if (!existingItem) {
    category = createSidebarItemCategory(head);
    items.push(category);
  } else if (existingItem.item.type === "doc") {
    category = createSidebarItemCategory(head);
    items[existingItem.index] = category;
  } else {
    category = existingItem.item;
  }

  insertToSidebar(category.items, rest);
}

(async () => {
  const paths = await globby("tmp/api-docs/*.md", {
    cwd: WEBSITE_ROOT,
    absolute: true
  });
  const sidebarItems: SidebarItem[] = [
    {
      type: "doc",
      id: "api/index"
    }
  ];

  await rm(DEST_DIR, { recursive: true, force: true });

  for (const path of paths) {
    console.log("Processing:", path);

    let content = await readFile(path, "utf-8");
    const lines = content.split(EOL);
    const title = content.match(/## *(.+)/)?.[1].replace(/\\/g, "");
    const breadcrumbs = parseBreadcrumb(lines[2]).slice(1);
    const frontMatter: Record<string, unknown> = {
      ...(title && { title }),
      pagination_prev: null,
      pagination_next: null
    };

    if (breadcrumbs.length) {
      insertToSidebar(sidebarItems, breadcrumbs);
    }

    // Remove the first 7 lines
    content = lines.slice(7).join(EOL);

    // Remove `<!-- -->`
    content = content.replace(/<!-- -->/g, "");

    // Write front matter
    content = `---\n${dump(frontMatter)}---\n${content}`;

    // Write API doc file
    const dest = join(DEST_DIR, basename(path));
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, content);
  }

  await writeFile(
    join(WEBSITE_ROOT, "tmp/api-sidebar.json"),
    JSON.stringify(sidebarItems, null, "  ")
  );
})().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
