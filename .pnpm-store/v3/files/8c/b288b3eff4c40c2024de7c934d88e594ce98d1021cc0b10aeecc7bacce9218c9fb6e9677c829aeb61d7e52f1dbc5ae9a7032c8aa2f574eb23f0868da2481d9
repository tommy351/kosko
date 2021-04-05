import { register } from "@kubernetes-models/validate";
import { addSchema as IoK8sApiCoreV1LimitRangeItem } from "./IoK8sApiCoreV1LimitRangeItem.mjs";
const schema = {
    "properties": {
        "limits": {
            "items": {
                "$ref": "io.k8s.api.core.v1.LimitRangeItem#"
            },
            "type": "array"
        }
    },
    "required": [
        "limits"
    ],
    "type": "object"
};
export function addSchema() {
    IoK8sApiCoreV1LimitRangeItem();
    register("io.k8s.api.core.v1.LimitRangeSpec", schema);
}
