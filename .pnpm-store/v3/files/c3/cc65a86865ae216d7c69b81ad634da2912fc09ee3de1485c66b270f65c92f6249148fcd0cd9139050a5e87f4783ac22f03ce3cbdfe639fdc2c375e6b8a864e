import { register } from "@kubernetes-models/validate";
import { addSchema as IoK8sApiAutoscalingV2beta2MetricTarget } from "./IoK8sApiAutoscalingV2beta2MetricTarget.mjs";
const schema = {
    "properties": {
        "name": {
            "type": "string"
        },
        "target": {
            "$ref": "io.k8s.api.autoscaling.v2beta2.MetricTarget#"
        }
    },
    "required": [
        "name",
        "target"
    ],
    "type": "object"
};
export function addSchema() {
    IoK8sApiAutoscalingV2beta2MetricTarget();
    register("io.k8s.api.autoscaling.v2beta2.ResourceMetricSource", schema);
}
