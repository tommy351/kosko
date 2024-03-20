import { rules } from "../../plugins/lint/src/rules/registry";
import recommended from "../../plugins/lint/src/presets/recommended";
import { dirname, join } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";

const DEST = join(__dirname, "../tmp/lint-rules-metadata.json");

(async () => {
  const validateAllRules = [];

  for (const [key, rule] of Object.entries(rules)) {
    const evaluatedRule = rule.factory({
      severity: "error",
      report() {}
    });

    if (evaluatedRule.validateAll) {
      validateAllRules.push(key);
    }
  }

  await mkdir(dirname(DEST), { recursive: true });
  await writeFile(
    DEST,
    JSON.stringify(
      {
        validateAll: validateAllRules,
        presets: {
          recommended: Object.keys(recommended.rules)
        }
      },
      null,
      "  "
    )
  );
})().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
