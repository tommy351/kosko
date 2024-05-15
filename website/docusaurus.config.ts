import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import globby from "globby";
import ts2js from "./remark-plugins/ts2js/index.js";
import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const workspaceRoot = fileURLToPath(new URL("..", import.meta.url));
const organizationName = "tommy351";
const projectName = "kosko";
const githubUrl = `https://github.com/${organizationName}/${projectName}`;
const commitRef =
  process.env.CF_PAGES_COMMIT_SHA || process.env.CF_PAGES_BRANCH || "master";

export default {
  title: "Kosko",
  tagline: "Organize Kubernetes manifests in TypeScript.",
  url: "https://kosko.dev",
  baseUrl: "/",
  onBrokenLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName,
  projectName,
  trailingSlash: false,
  themeConfig: {
    image: "img/logo.png",
    metadata: [{ name: "twitter:card", content: "summary" }],
    navbar: {
      title: "Kosko",
      logo: {
        alt: "My Site Logo",
        src: "img/logo.svg"
      },
      items: [
        {
          type: "doc",
          label: "Docs",
          position: "left",
          docId: "getting-started"
        },
        {
          type: "docSidebar",
          label: "Plugins",
          position: "left",
          sidebarId: "plugins"
        },
        { to: "api", label: "API", position: "left" },
        { to: "blog", label: "Blog", position: "left" },
        { to: "play", label: "Playground", position: "left" },
        {
          href: githubUrl,
          label: "GitHub",
          position: "right"
        }
      ]
    },
    footer: {
      style: "dark",
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} Tommy Chen. Built with Docusaurus.`
    },
    prism: {
      additionalLanguages: ["toml"],
      theme: prismThemes.oceanicNext
    },
    algolia: {
      appId: "DAH00NTYY8",
      apiKey: "12c13b7df74f9fe6724e69765e489572",
      indexName: "kosko"
    }
  } satisfies Preset.ThemeConfig,
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: "./sidebars.js",
          editUrl: `${githubUrl}/edit/master/website/`,
          remarkPlugins: [ts2js],
          docItemComponent: "@site/src/modules/doc/components/DocItem"
        },
        pages: {
          remarkPlugins: [ts2js]
        },
        blog: {
          showReadingTime: true,
          editUrl: `${githubUrl}/edit/master/website/blog/`
        },
        theme: {
          customCss: "./src/css/custom.scss"
        },
        gtag: {
          trackingID: "G-2CPELJ4990",
          anonymizeIP: true
        }
      } satisfies Preset.Options
    ]
  ],
  plugins: [
    "docusaurus-plugin-sass",
    "@docusaurus/plugin-ideal-image",
    [
      "docusaurus-plugin-typedoc-api",
      {
        projectRoot: workspaceRoot,
        packages: globby
          .sync("packages/*/tsconfig.json", { cwd: workspaceRoot })
          .map((path) => dirname(path)),
        gitRefName: commitRef
      }
    ],
    "./plugins/lodash-webpack-plugin",
    "./plugins/lint-rules-metadata-plugin"
  ]
} satisfies Config;
