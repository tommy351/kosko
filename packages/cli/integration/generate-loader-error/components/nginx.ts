import { Pod } from "kubernetes-models/v1/Pod";

export default new Pod({
  metadata: {
    name: "test-pod"
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error We need validation error in this test.
  spec: {}
});
