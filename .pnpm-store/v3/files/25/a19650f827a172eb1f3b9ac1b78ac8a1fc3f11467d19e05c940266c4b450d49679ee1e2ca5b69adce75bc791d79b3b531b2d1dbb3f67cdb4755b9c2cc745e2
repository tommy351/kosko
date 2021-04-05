import { register } from "@kubernetes-models/validate";
const schema = {
    "properties": {
        "name": {
            "type": "string"
        },
        "value": {
            "type": "string"
        }
    },
    "required": [
        "name",
        "value"
    ],
    "type": "object"
};
export function addSchema() {
    register("io.k8s.api.core.v1.HTTPHeader", schema);
}
