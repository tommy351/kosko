import { parseAllDocuments, visit } from "yaml";

const reLegacyOctNum = /^0[0-7]+$/;

// Match all-lowercase, all-uppercase, and title-case variants
const legacyTrues = new Set(["y", "Y", "yes", "Yes", "YES", "on", "On", "ON"]);
const legacyFalses = new Set(["n", "N", "no", "No", "NO", "off", "Off", "OFF"]);

/**
 * The purpose of this function is to match the behavior of [sigs.k8s.io/yaml]
 * as closely as possible.
 *
 * [sigs.k8s.io/yaml] uses [go-yaml](https://github.com/go-yaml/yaml) under the
 * hood, which supports most of YAML 1.2, but preserves some YAML 1.1 behaviors
 * for backwards compatibility. You can see [here](https://github.com/go-yaml/yaml?tab=readme-ov-file#compatibility)
 * for more information.
 *
 * [sigs.k8s.io/yaml]: https://pkg.go.dev/sigs.k8s.io/yaml
 * [go-yaml]: https://github.com/go-yaml/yaml
 */
export function parse(content: string): unknown[] {
  const documents = parseAllDocuments(content, {
    // Enable map merging
    merge: true
  });
  const results = [];

  for (const doc of documents) {
    visit(doc, {
      Scalar(key, node) {
        if (node.type !== "PLAIN" || !node.source) return;

        // Handle YAML 1.1 octal numbers
        if (
          typeof node.value === "number" &&
          reLegacyOctNum.test(node.source)
        ) {
          node.value = parseInt(node.source, 8);
        }

        // Handle YAML 1.1 booleans
        if (typeof node.value === "string") {
          if (legacyTrues.has(node.source)) {
            node.value = true;
          } else if (legacyFalses.has(node.source)) {
            node.value = false;
          }
        }
      }
    });

    results.push(doc.toJSON());
  }

  return results;
}
