import { readdir } from "node:fs/promises";

// Based on:
// - https://github.com/github/gitignore/blob/ce6f84024931408ce801808fe9f4587f7588b283/Node.gitignore
// - https://github.com/vercel/next.js/blob/bee8c31/packages/create-next-app/helpers/is-folder-empty.ts
const IGNORE_FILES: (string | RegExp)[] = [
  ".DS_Store",
  ".git",
  ".gitattributes",
  ".gitignore",
  ".hg",
  ".hgcheck",
  ".hgignore",
  ".idea",
  ".npmignore",
  "LICENSE",
  "Thumbs.db",
  ".yarn",
  /\.log$/,
  "node_modules",
  ".npm",
  ".cache"
];

function shouldIgnoreFile(name: string): boolean {
  return IGNORE_FILES.some((pattern) =>
    typeof pattern === "string" ? name === pattern : pattern.test(name)
  );
}

export default async function isFolderEmpty(path: string): Promise<boolean> {
  const files = await readdir(path);
  const filtered = files.filter((name) => !shouldIgnoreFile(name));

  return !filtered.length;
}
