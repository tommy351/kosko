import { register } from "@kubernetes-models/validate";
const schema = {
    "properties": {
        "clientCIDR": {
            "type": "string"
        },
        "serverAddress": {
            "type": "string"
        }
    },
    "required": [
        "clientCIDR",
        "serverAddress"
    ],
    "type": "object"
};
export function addSchema() {
    register("io.k8s.apimachinery.pkg.apis.meta.v1.ServerAddressByClientCIDR", schema);
}
