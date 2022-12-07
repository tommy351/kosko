import { runDenoCLI } from "../../utils/run";

test("should print migrated manifests", async () => {
  const result = await runDenoCLI(["migrate", "-f", "-"], {
    input: `apiVersion: v1
kind: Pod
metadata:
  name: test-pod
spec:
  containers: []`
  });

  expect(result.stdout).toMatchSnapshot();
});
