import { register } from "@kubernetes-models/validate";
const schema = {
    "oneOf": [
        {
            "type": "string"
        },
        {
            "type": "integer",
            "format": "int32"
        }
    ]
};
export function addSchema() {
    register("io.k8s.apimachinery.pkg.util.intstr.IntOrString", schema);
}
