"use strict";

const organizationName = "tommy351";
const projectName = "kosko";
const githubUrl = `https://github.com/${organizationName}/${projectName}`;

module.exports = {
  title: "Kosko",
  tagline: "Write Kubernetes manifests in JavaScript.",
  url: "https://kosko.dev",
  baseUrl: "/",
  favicon: "",
  organizationName,
  projectName,
  themeConfig: {
    navbar: {
      title: "Kosko",
      links: [
        {
          to: "docs/overview",
          activeBasePath: "docs",
          label: "Docs",
          position: "left"
        },
        {
          href: "api",
          label: "API",
          position: "left"
        },
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
    googleAnalytics: {
      trackingID: "UA-4910098-13"
    }
  },
  themes: [
    [
      "@docusaurus/theme-classic",
      {
        customCss: require.resolve("./src/css/custom.css")
      }
    ]
  ],
  plugins: [
    "@docusaurus/plugin-content-pages",
    "@docusaurus/plugin-sitemap",
    "@docusaurus/plugin-google-analytics",
    [
      "@docusaurus/plugin-content-docs",
      {
        editUrl: `${githubUrl}/edit/master/website/`,
        sidebarPath: require.resolve("./sidebars.json")
      }
    ]
  ]
};
