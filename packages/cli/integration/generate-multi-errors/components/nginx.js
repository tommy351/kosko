const { Deployment } = require("kubernetes-models/apps/v1/Deployment");
const { Service } = require("kubernetes-models/v1/Service");

const deployment = new Deployment({
  metadata: {
    name: "nginx"
  },
  spec: {}
});

const service = new Service({
  metadata: {
    name: "nginx"
  },
  spec: {
    type: "Foo",
    ports: [{ port: "x" }]
  }
});

module.exports = [deployment, service];
