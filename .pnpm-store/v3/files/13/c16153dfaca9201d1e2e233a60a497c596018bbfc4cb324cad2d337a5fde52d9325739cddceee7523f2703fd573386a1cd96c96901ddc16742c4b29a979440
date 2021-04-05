import { register } from "@kubernetes-models/validate";
import { addSchema as IoK8sApiStorageV1VolumeAttachmentSource } from "./IoK8sApiStorageV1VolumeAttachmentSource.mjs";
const schema = {
    "properties": {
        "attacher": {
            "type": "string"
        },
        "nodeName": {
            "type": "string"
        },
        "source": {
            "$ref": "io.k8s.api.storage.v1.VolumeAttachmentSource#"
        }
    },
    "required": [
        "attacher",
        "source",
        "nodeName"
    ],
    "type": "object"
};
export function addSchema() {
    IoK8sApiStorageV1VolumeAttachmentSource();
    register("io.k8s.api.storage.v1.VolumeAttachmentSpec", schema);
}
