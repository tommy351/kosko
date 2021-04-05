import { register } from "@kubernetes-models/validate";
const schema = {
    "properties": {
        "periodSeconds": {
            "format": "int32",
            "type": "integer"
        },
        "type": {
            "type": "string"
        },
        "value": {
            "format": "int32",
            "type": "integer"
        }
    },
    "required": [
        "type",
        "value",
        "periodSeconds"
    ],
    "type": "object"
};
export function addSchema() {
    register("io.k8s.api.autoscaling.v2beta2.HPAScalingPolicy", schema);
}
