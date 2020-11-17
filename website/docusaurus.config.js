"use strict";

const organizationName = "tommy351";
const projectName = "kosko";
const githubUrl = `https://github.com/${organizationName}/${projectName}`;

module.exports = {
  title: "Kosko",
  tagline: "Write Kubernetes manifests in JavaScript.",
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
          to: "docs/",
          activeBasePath: "docs",
          label: "Docs",
          position: "left"
        },
        { to: "blog", label: "Blog", position: "left" },
        { href: "/api/", label: "API", position: "left" },
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
      additionalLanguages: ["toml"]
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
          customCss: require.resolve("./src/css/custom.css")
        }
      }
    ]
  ]
};
