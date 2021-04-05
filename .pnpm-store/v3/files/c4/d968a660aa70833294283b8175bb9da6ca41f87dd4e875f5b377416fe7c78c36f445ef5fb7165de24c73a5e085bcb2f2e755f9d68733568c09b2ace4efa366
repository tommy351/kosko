import { register } from "@kubernetes-models/validate";
const schema = {
    "properties": {
        "driver": {
            "type": "string"
        }
    },
    "required": [
        "driver"
    ],
    "type": "object"
};
export function addSchema() {
    register("io.k8s.api.policy.v1beta1.AllowedFlexVolume", schema);
}
