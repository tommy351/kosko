/* eslint-disable node/no-unpublished-require */
"use strict";

const globby = require("globby");
const fs = require("fs-extra");
const { join, dirname, extname } = require("path");
const { Application, TSConfigReader, PageEvent } = require("typedoc");
const {
  getPageTitle,
  prependYAML
} = require("typedoc-plugin-markdown/dist/utils/front-matter");

const WEBSITE_DIR = dirname(__dirname);
const ROOT_DIR = dirname(WEBSITE_DIR);

async function getEntryPoints() {
  const tsconfigs = await globby("packages/*/tsconfig.json", {
    cwd: ROOT_DIR,
    absolute: true
  });
  const entryPoints = [];

  for (const tsconfig of tsconfigs) {
    const pkgDir = dirname(tsconfig);
    const { source } = await fs.readJSON(join(pkgDir, "package.json"));

    if (source) {
      entryPoints.push(join(pkgDir, source));
    }
  }

  return entryPoints;
}

(async () => {
  const app = new Application();

  app.options.addReader(new TSConfigReader());

  app.bootstrap({
    name: "Kosko",
    plugin: ["typedoc-plugin-markdown"],
    excludePrivate: true,
    hideBreadcrumbs: true,
    hideInPageTOC: true,
    hidePageTitle: true,
    githubPages: false,
    entryPoints: await getEntryPoints(),
    tsconfig: join(__dirname, "../tsconfig.typedoc.json")
  });

  app.renderer.listenTo(app.renderer, {
    [PageEvent.END]: (page) => {
      if (page.contents) {
        const path = page.url.substring(
          0,
          page.url.length - extname(page.url).length
        );
        const isGlobals = path === "modules";
        page.contents = prependYAML(page.contents, {
          title: getPageTitle(page),
          sidebar_label: page.model.name,
          ...(isGlobals && {
            slug: "/api",
            title: "Overview",
            sidebar_label: "Overview"
          })
        });
      }
    }
  });

  const project = app.convert();
  const outDir = join(WEBSITE_DIR, "docs", "api");

  await fs.remove(outDir);
  await app.generateDocs(project, outDir);
  await fs.remove(join(outDir, "README.md"));
})().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
