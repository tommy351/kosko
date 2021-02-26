/* eslint-disable node/no-unpublished-require */
"use strict";

const del = require("del");
const globby = require("globby");
const { join, dirname, extname } = require("path");
const { Application, TSConfigReader } = require("typedoc");
const {
  FrontMatterComponent
} = require("typedoc-plugin-markdown/dist/components/front-matter");

const WEBSITE_DIR = dirname(__dirname);
const ROOT_DIR = dirname(WEBSITE_DIR);

class DocsaurusFrontMatterComponent extends FrontMatterComponent {
  getYamlItems(page) {
    const path = page.url.substring(
      0,
      page.url.length - extname(page.url).length
    );

    const isGlobals = path === "modules";
    const slug = `/api${isGlobals ? "" : `/${path}`}`;
    const title = isGlobals ? "Overview" : page.model.name;

    return {
      id: this.getId(page),
      title,
      slug,
      hide_title: true
    };
  }
}

(async () => {
  const app = new Application();

  app.options.addReader(new TSConfigReader());

  const entryPoints = await globby("packages/*/src/index.ts", {
    cwd: ROOT_DIR,
    absolute: true
  });

  app.bootstrap({
    name: "Kosko",
    plugin: ["typedoc-plugin-markdown"],
    excludePrivate: true,
    hideBreadcrumbs: true,
    hideProjectName: true,
    hideInPageTOC: true,
    entryPoints,
    tsconfig: join(__dirname, "../tsconfig.typedoc.json")
  });

  app.renderer.addComponent(
    "frontmatter",
    new DocsaurusFrontMatterComponent(app.renderer)
  );

  const project = app.convert();
  const outDir = join(WEBSITE_DIR, "docs", "api");

  await del(outDir);
  await app.generateDocs(project, outDir);
  await del(join(outDir, "README.md"));
})().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
