const {
  PodTemplateSpec,
  PodSpec,
  Container
} = require("kubernetes-models/api/core/v1");
const { Deployment, DeploymentSpec } = require("kubernetes-models/api/apps/v1");

module.exports = new Deployment({
  spec: new DeploymentSpec({
    template: new PodTemplateSpec({
      spec: new PodSpec({
        containers: [
          new Container({
            image: "nginx"
          })
        ]
      })
    })
  })
});
