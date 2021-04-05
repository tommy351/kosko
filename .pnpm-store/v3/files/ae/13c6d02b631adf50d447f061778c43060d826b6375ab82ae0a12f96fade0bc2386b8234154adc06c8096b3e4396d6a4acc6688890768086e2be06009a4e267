import { register } from "@kubernetes-models/validate";
const schema = {
    "properties": {
        "key": {
            "type": "string"
        },
        "values": {
            "items": {
                "type": "string"
            },
            "type": "array"
        }
    },
    "required": [
        "key",
        "values"
    ],
    "type": "object"
};
export function addSchema() {
    register("io.k8s.api.core.v1.TopologySelectorLabelRequirement", schema);
}
