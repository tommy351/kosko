// eslint-disable-next-line node/no-missing-import
import { Pod } from "npm:kubernetes-models@^4/v1/Pod";

const pod = new Pod({
  metadata: { name: "folder-esm" }
});

export default pod;
