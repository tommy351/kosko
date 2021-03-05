import { loadString } from "../../dist/load.mjs";
import { Pod } from "kubernetes-models/v1/Pod.mjs";

describe("loadString", () => {
  test("should load Kubernetes objects", async () => {
    const result = loadString(
      `
apiVersion: v1
kind: Pod
metadata:
  name: foo
`.trim()
    );

    await expect(result).resolves.toEqual([
      new Pod({
        metadata: { name: "foo" }
      })
    ]);
  });
});
