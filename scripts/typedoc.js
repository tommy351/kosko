/* eslint-disable node/no-unpublished-require */
"use strict";

const TypeDoc = require("typedoc");
const globby = require("globby");
const { dirname, join, extname } = require("path");
const del = require("del");
const {
  FrontMatterComponent
} = require("typedoc-plugin-markdown/dist/components/front-matter.component");

const ROOT_DIR = dirname(__dirname);

class DocsaurusFrontMatterComponent extends FrontMatterComponent {
  getYamlItems(page) {
    const path = page.url.substring(
      0,
      page.url.length - extname(page.url).length
    );
    const isGlobals = path === "globals";
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
  const app = new TypeDoc.Application();

  app.options.addReader(new TypeDoc.TSConfigReader());

  const { hasErrors } = app.bootstrap({
    name: "Kosko",
    mode: "modules",
    plugin: ["typedoc-plugin-lerna-packages", "typedoc-plugin-markdown"],
    exclude: ["**/__tests__/**", "**/__fixtures__/**", "**/__mocks__/**"],
    excludePrivate: true,
    excludeNotExported: true,
    lernaExclude: ["kosko", "@kosko/website"],
    readme: "README.md",
    hideBreadcrumbs: true,
    hideProjectName: true
  });

  if (hasErrors) {
    throw new Error("Bootstrap failed");
  }

  const outDir = "docs/api";
  const fullOutDir = join(ROOT_DIR, "website", outDir);

  app.renderer.addComponent(
    "frontmatter",
    new DocsaurusFrontMatterComponent(app.renderer)
  );

  const inputFiles = app.expandInputFiles(
    await globby("packages/*/src", {
      cwd: ROOT_DIR,
      onlyDirectories: true
    })
  );

  const project = app.convert(inputFiles);

  await del(fullOutDir);
  app.generateDocs(project, fullOutDir);
  await del(join(fullOutDir, "README.md"));

  if (app.logger.hasErrors()) {
    throw new Error("Generate failed");
  }
})().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
