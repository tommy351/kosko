import { migrateString } from "../../mod.ts";
import { expect } from "@test/deps.ts";

describe("@kosko/migrate migrateString", () => {
  describe("given valid YAML", () => {
    test("should generate code", async () => {
      await expect(
        migrateString(`---
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
spec:
  containers: []
`)
      ).to.eventually.equal(
        `import { Pod } from "kubernetes-models/v1/Pod";

const pod = new Pod({
  "metadata": {
    "name": "test-pod"
  },
  "spec": {
    "containers": []
  }
});

export default [pod];
`
      );
    });
  });
});
