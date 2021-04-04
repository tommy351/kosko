"use strict";

const organizationName = "tommy351";
const projectName = "kosko";
const githubUrl = `https://github.com/${organizationName}/${projectName}`;

module.exports = {
  title: "Kosko",
  tagline: "Organize Kubernetes manifests in JavaScript.",
  url: "https://kosko.dev",
  baseUrl: "/",
  onBrokenLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName,
  projectName,
  themeConfig: {
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
          type: "doc",
          label: "API",
          position: "left",
          docId: "api/modules"
        },
        { to: "blog", label: "Blog", position: "left" },
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
      theme: require("prism-react-renderer/themes/oceanicNext")
    },
    gtag: {
      trackingID: "G-2CPELJ4990",
      anonymizeIP: true
    },
    algolia: {
      apiKey: "23788e4b80d39b6c0cdea10cd50d3663",
      indexName: "kosko"
    }
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: `${githubUrl}/edit/master/website/`
        },
        blog: {
          showReadingTime: true,
          editUrl: `${githubUrl}/edit/master/website/blog/`
        },
        theme: {
          customCss: require.resolve("./src/css/custom.scss")
        }
      }
    ]
  ],
  plugins: ["docusaurus-plugin-sass"]
};
