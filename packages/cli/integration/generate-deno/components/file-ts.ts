import { Pod } from "kubernetes-models/v1/Pod";

const pod = new Pod({
  metadata: { name: "file-ts" }
});

export default pod;
