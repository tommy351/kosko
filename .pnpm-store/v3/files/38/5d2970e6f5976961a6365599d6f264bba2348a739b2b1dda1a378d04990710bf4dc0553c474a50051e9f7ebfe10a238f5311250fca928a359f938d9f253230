import { register } from "@kubernetes-models/validate";
const schema = {
    "properties": {
        "groupVersion": {
            "type": "string"
        },
        "version": {
            "type": "string"
        }
    },
    "required": [
        "groupVersion",
        "version"
    ],
    "type": "object"
};
export function addSchema() {
    register("io.k8s.apimachinery.pkg.apis.meta.v1.GroupVersionForDiscovery", schema);
}
