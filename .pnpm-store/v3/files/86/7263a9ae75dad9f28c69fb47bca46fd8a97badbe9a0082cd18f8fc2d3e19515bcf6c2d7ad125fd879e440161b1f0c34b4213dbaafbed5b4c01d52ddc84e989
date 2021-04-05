import { register } from "@kubernetes-models/validate";
const schema = {
    "properties": {
        "Port": {
            "format": "int32",
            "type": "integer"
        }
    },
    "required": [
        "Port"
    ],
    "type": "object"
};
export function addSchema() {
    register("io.k8s.api.core.v1.DaemonEndpoint", schema);
}
