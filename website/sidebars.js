"use strict";

module.exports = {
  docs: [
    {
      type: "category",
      label: "Introduction",
      collapsed: false,
      items: [
        "getting-started",
        "overview",
        "components",
        "environments",
        "templates"
      ]
    },
    {
      type: "category",
      label: "Guides",
      collapsed: false,
      items: [
        "loading-kubernetes-yaml",
        "loading-helm-chart",
        "loading-kustomize",
        "typescript-support",
        "ecmascript-modules",
        "programmatic-usage",
        "using-in-browser",
        "troubleshooting"
      ]
    },
    {
      type: "category",
      label: "Reference",
      collapsed: false,
      items: ["commands", "configuration"]
    }
  ],
  api: [{ type: "autogenerated", dirName: "api" }]
};
