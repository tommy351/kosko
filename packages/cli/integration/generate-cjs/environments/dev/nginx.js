module.exports = {
  replicas: 1,
  tolerations: [
    { key: "key1", operator: "Equal", value: "value1", effect: "NoSchedule" },
    { key: "key2", operator: "Equal", value: "value2", effect: "NoExecute" },
    { key: "key3", operator: "Equal", value: "value3", effect: "NoSchedule" }
  ]
};
