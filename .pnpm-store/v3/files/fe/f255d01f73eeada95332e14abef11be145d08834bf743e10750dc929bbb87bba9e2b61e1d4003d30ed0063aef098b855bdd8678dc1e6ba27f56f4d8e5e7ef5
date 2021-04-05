import { register } from "@kubernetes-models/validate";
const schema = {
    "properties": {
        "name": {
            "type": "string"
        }
    },
    "required": [
        "name"
    ],
    "type": "object"
};
export function addSchema() {
    register("io.k8s.api.policy.v1beta1.AllowedCSIDriver", schema);
}
