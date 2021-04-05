import { register } from "@kubernetes-models/validate";
const schema = {
    "properties": {
        "conditionType": {
            "type": "string"
        }
    },
    "required": [
        "conditionType"
    ],
    "type": "object"
};
export function addSchema() {
    register("io.k8s.api.core.v1.PodReadinessGate", schema);
}
