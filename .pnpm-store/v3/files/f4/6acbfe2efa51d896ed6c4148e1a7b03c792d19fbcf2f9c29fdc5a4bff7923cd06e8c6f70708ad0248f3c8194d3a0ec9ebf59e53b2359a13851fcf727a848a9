import { register } from "@kubernetes-models/validate";
import { addSchema as IoK8sApiCoreV1NodeSelectorTerm } from "./IoK8sApiCoreV1NodeSelectorTerm.mjs";
const schema = {
    "properties": {
        "preference": {
            "$ref": "io.k8s.api.core.v1.NodeSelectorTerm#"
        },
        "weight": {
            "format": "int32",
            "type": "integer"
        }
    },
    "required": [
        "weight",
        "preference"
    ],
    "type": "object"
};
export function addSchema() {
    IoK8sApiCoreV1NodeSelectorTerm();
    register("io.k8s.api.core.v1.PreferredSchedulingTerm", schema);
}
