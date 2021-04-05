import { register } from "@kubernetes-models/validate";
const schema = {
    "properties": {
        "apiGroup": {
            "type": "string"
        },
        "kind": {
            "type": "string"
        },
        "name": {
            "type": "string"
        }
    },
    "required": [
        "apiGroup",
        "kind",
        "name"
    ],
    "type": "object"
};
export function addSchema() {
    register("io.k8s.api.rbac.v1beta1.RoleRef", schema);
}
