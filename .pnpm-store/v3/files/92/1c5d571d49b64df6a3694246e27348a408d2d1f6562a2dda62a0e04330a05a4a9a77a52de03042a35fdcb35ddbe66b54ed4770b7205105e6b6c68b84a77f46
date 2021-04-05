import { register } from "@kubernetes-models/validate";
import { addSchema as IoK8sApiStorageV1CSINodeDriver } from "./IoK8sApiStorageV1CSINodeDriver.mjs";
const schema = {
    "properties": {
        "drivers": {
            "items": {
                "$ref": "io.k8s.api.storage.v1.CSINodeDriver#"
            },
            "type": "array"
        }
    },
    "required": [
        "drivers"
    ],
    "type": "object"
};
export function addSchema() {
    IoK8sApiStorageV1CSINodeDriver();
    register("io.k8s.api.storage.v1.CSINodeSpec", schema);
}
