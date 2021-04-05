import { register } from "@kubernetes-models/validate";
const schema = {
    "properties": {
        "devicePath": {
            "type": "string"
        },
        "name": {
            "type": "string"
        }
    },
    "required": [
        "name",
        "devicePath"
    ],
    "type": "object"
};
export function addSchema() {
    register("io.k8s.api.core.v1.VolumeDevice", schema);
}
