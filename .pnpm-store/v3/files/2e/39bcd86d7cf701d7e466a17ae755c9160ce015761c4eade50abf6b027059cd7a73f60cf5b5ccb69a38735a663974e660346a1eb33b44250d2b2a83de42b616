import { register } from "@kubernetes-models/validate";
import { addSchema as IoK8sApiExtensionsV1beta1HTTPIngressPath } from "./IoK8sApiExtensionsV1beta1HTTPIngressPath.mjs";
const schema = {
    "properties": {
        "paths": {
            "items": {
                "$ref": "io.k8s.api.extensions.v1beta1.HTTPIngressPath#"
            },
            "type": "array"
        }
    },
    "required": [
        "paths"
    ],
    "type": "object"
};
export function addSchema() {
    IoK8sApiExtensionsV1beta1HTTPIngressPath();
    register("io.k8s.api.extensions.v1beta1.HTTPIngressRuleValue", schema);
}
