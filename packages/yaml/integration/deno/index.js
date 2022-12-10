import { loadString } from "../../dist/index.deno.mjs";

const result = await loadString(`
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
`);

console.log(result);
