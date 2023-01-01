/* eslint-disable node/no-missing-import */
import { loadString } from "npm:@kosko/yaml";

const result = await loadString(`
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
`);

console.log(result);
