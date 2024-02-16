import { loadString } from "@kosko/yaml";
import { Console } from "node:console";

const logger = new Console({
  stdout: process.stdout,
  stderr: process.stderr,
  colorMode: false
});

const result = await loadString(`
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
`);

logger.log(result);
