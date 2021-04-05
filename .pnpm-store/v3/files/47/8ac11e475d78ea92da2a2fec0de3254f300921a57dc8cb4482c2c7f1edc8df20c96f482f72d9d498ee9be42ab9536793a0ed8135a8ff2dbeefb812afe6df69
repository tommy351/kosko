import { register } from "@kubernetes-models/validate";
import { addSchema as IoK8sApiAutoscalingV2beta2CrossVersionObjectReference } from "./IoK8sApiAutoscalingV2beta2CrossVersionObjectReference.mjs";
import { addSchema as IoK8sApiAutoscalingV2beta2MetricIdentifier } from "./IoK8sApiAutoscalingV2beta2MetricIdentifier.mjs";
import { addSchema as IoK8sApiAutoscalingV2beta2MetricTarget } from "./IoK8sApiAutoscalingV2beta2MetricTarget.mjs";
const schema = {
    "properties": {
        "describedObject": {
            "$ref": "io.k8s.api.autoscaling.v2beta2.CrossVersionObjectReference#"
        },
        "metric": {
            "$ref": "io.k8s.api.autoscaling.v2beta2.MetricIdentifier#"
        },
        "target": {
            "$ref": "io.k8s.api.autoscaling.v2beta2.MetricTarget#"
        }
    },
    "required": [
        "describedObject",
        "target",
        "metric"
    ],
    "type": "object"
};
export function addSchema() {
    IoK8sApiAutoscalingV2beta2CrossVersionObjectReference();
    IoK8sApiAutoscalingV2beta2MetricIdentifier();
    IoK8sApiAutoscalingV2beta2MetricTarget();
    register("io.k8s.api.autoscaling.v2beta2.ObjectMetricSource", schema);
}
