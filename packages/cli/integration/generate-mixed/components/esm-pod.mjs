import { Pod } from "kubernetes-models/v1/Pod";
import env from "@kosko/env";

const params = await env.global();

export default new Pod({
  metadata: {
    name: "esm-pod",
    labels: params
  }
});
