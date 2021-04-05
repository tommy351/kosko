import { register } from "@kubernetes-models/validate";
import { addSchema as IoK8sApiCoreV1NodeSelectorTerm } from "./IoK8sApiCoreV1NodeSelectorTerm.mjs";
const schema = {
    "properties": {
        "nodeSelectorTerms": {
            "items": {
                "$ref": "io.k8s.api.core.v1.NodeSelectorTerm#"
            },
            "type": "array"
        }
    },
    "required": [
        "nodeSelectorTerms"
    ],
    "type": "object"
};
export function addSchema() {
    IoK8sApiCoreV1NodeSelectorTerm();
    register("io.k8s.api.core.v1.NodeSelector", schema);
}
