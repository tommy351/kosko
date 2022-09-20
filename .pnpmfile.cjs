"use strict";

module.exports = {
  hooks: {
    readPackage(pkg) {
      // Fix duplicated `@docusaurus/theme-common` package.
      // https://github.com/facebook/docusaurus/issues/6724#issuecomment-1188794031
      if (
        pkg.name?.startsWith("@docusaurus/") &&
        pkg.dependencies?.["@docusaurus/theme-common"]
      ) {
        pkg.peerDependencies = {
          ...pkg.peerDependencies,
          "@docusaurus/theme-common":
            pkg.dependencies["@docusaurus/theme-common"]
        };

        delete pkg.dependencies["@docusaurus/theme-common"];
      }

      return pkg;
    }
  }
};
