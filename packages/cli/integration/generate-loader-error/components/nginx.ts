import { Pod } from "kubernetes-models/v1/Pod";

export default new Pod({
  metadata: {
    name: "test-pod"
  },
  // @ts-expect-error We need validation error in this test.
  spec: {}
});
