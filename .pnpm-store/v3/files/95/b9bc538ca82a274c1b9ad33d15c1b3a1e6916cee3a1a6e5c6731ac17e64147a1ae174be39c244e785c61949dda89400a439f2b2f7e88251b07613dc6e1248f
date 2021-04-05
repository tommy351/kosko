import { register } from "@kubernetes-models/validate";
const schema = {
    "properties": {
        "max": {
            "format": "int32",
            "type": "integer"
        },
        "min": {
            "format": "int32",
            "type": "integer"
        }
    },
    "required": [
        "min",
        "max"
    ],
    "type": "object"
};
export function addSchema() {
    register("io.k8s.api.policy.v1beta1.HostPortRange", schema);
}
