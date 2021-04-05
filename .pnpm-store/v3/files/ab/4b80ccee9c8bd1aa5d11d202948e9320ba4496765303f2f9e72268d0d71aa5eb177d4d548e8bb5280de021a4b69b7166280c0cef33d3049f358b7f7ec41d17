import { register } from "@kubernetes-models/validate";
const schema = {
    "properties": {
        "architecture": {
            "type": "string"
        },
        "bootID": {
            "type": "string"
        },
        "containerRuntimeVersion": {
            "type": "string"
        },
        "kernelVersion": {
            "type": "string"
        },
        "kubeProxyVersion": {
            "type": "string"
        },
        "kubeletVersion": {
            "type": "string"
        },
        "machineID": {
            "type": "string"
        },
        "operatingSystem": {
            "type": "string"
        },
        "osImage": {
            "type": "string"
        },
        "systemUUID": {
            "type": "string"
        }
    },
    "required": [
        "machineID",
        "systemUUID",
        "bootID",
        "kernelVersion",
        "osImage",
        "containerRuntimeVersion",
        "kubeletVersion",
        "kubeProxyVersion",
        "operatingSystem",
        "architecture"
    ],
    "type": "object"
};
export function addSchema() {
    register("io.k8s.api.core.v1.NodeSystemInfo", schema);
}
