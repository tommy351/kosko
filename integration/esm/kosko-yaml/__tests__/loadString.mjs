import test from "ava";
import { loadString } from "../../../../packages/yaml/dist/index.mjs";
import { Pod } from "kubernetes-models/v1/Pod";

test("should load Kubernetes objects from string", async (t) => {
  const result = await loadString(
    `
apiVersion: v1
kind: Pod
metadata:
  name: foo
`.trim()
  );

  t.deepEqual(result, [
    new Pod({
      metadata: { name: "foo" }
    })
  ]);
});
