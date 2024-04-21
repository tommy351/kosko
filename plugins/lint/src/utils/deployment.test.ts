import { ReplicationController } from "kubernetes-models/v1/ReplicationController";
import { getDeploymentLikeSpec } from "./deployment";
import { Deployment } from "kubernetes-models/apps/v1/Deployment";
import { StatefulSet } from "kubernetes-models/apps/v1/StatefulSet";
import { CronJob } from "kubernetes-models/batch/v1/CronJob";
import { Job } from "kubernetes-models/batch/v1/Job";
import { DaemonSet } from "kubernetes-models/apps/v1/DaemonSet";
import { ReplicaSet } from "kubernetes-models/apps/v1/ReplicaSet";
import { Rollout } from "@kubernetes-models/argo-rollouts/argoproj.io/v1alpha1/Rollout";
import { Service } from "@kubernetes-models/knative/serving.knative.dev/v1/Service";
import { Configuration } from "@kubernetes-models/knative/serving.knative.dev/v1/Configuration";

describe("getDeploymentLikeSpec", () => {
  test("should return undefined when value is undefined", () => {
    expect(getDeploymentLikeSpec(undefined)).toBeUndefined();
  });

  test("should return undefined when value is null", () => {
    expect(getDeploymentLikeSpec(null)).toBeUndefined();
  });

  test("should return undefined when value is not an object", () => {
    expect(getDeploymentLikeSpec("test")).toBeUndefined();
  });

  test("should return undefined when value is a resource of another kind", () => {
    const value = {
      apiVersion: "v1",
      kind: "Service",
      spec: { ports: [] }
    };

    expect(getDeploymentLikeSpec(value)).toBeUndefined();
  });

  test("should return pod spec when value is a ReplicationController object", () => {
    const value = {
      apiVersion: "v1",
      kind: "ReplicationController",
      spec: {
        template: {
          spec: { containers: [] }
        }
      }
    };

    expect(getDeploymentLikeSpec(value)).toBe(value.spec);
  });

  test("should return pod spec when value is a ReplicationController instance", () => {
    const value = new ReplicationController({
      spec: {
        template: {
          spec: { containers: [] }
        }
      }
    });

    expect(getDeploymentLikeSpec(value)).toBe(value.spec);
  });

  test("should return pod spec when value is a Deployment object", () => {
    const value = {
      apiVersion: "apps/v1",
      kind: "Deployment",
      spec: {
        template: {
          spec: { containers: [] }
        }
      }
    };

    expect(getDeploymentLikeSpec(value)).toBe(value.spec);
  });

  test("should return pod spec when value is a Deployment instance", () => {
    const value = new Deployment({
      spec: {
        selector: {},
        template: {
          spec: { containers: [] }
        }
      }
    });

    expect(getDeploymentLikeSpec(value)).toBe(value.spec);
  });

  test("should return pod spec when value is a StatefulSet object", () => {
    const value = {
      apiVersion: "apps/v1",
      kind: "StatefulSet",
      spec: {
        template: {
          spec: { containers: [] }
        }
      }
    };

    expect(getDeploymentLikeSpec(value)).toBe(value.spec);
  });

  test("should return pod spec when value is a StatefulSet instance", () => {
    const value = new StatefulSet({
      spec: {
        serviceName: "test",
        selector: {},
        template: {
          spec: { containers: [] }
        }
      }
    });

    expect(getDeploymentLikeSpec(value)).toBe(value.spec);
  });

  test("should return pod spec when value is a DaemonSet object", () => {
    const value = {
      apiVersion: "apps/v1",
      kind: "DaemonSet",
      spec: {
        template: {
          spec: { containers: [] }
        }
      }
    };

    expect(getDeploymentLikeSpec(value)).toBe(value.spec);
  });

  test("should return pod spec when value is a DaemonSet instance", () => {
    const value = new DaemonSet({
      spec: {
        selector: {},
        template: {
          spec: { containers: [] }
        }
      }
    });

    expect(getDeploymentLikeSpec(value)).toBe(value.spec);
  });

  test("should return pod spec when value is a ReplicaSet object", () => {
    const value = {
      apiVersion: "apps/v1",
      kind: "ReplicaSet",
      spec: {
        template: {
          spec: { containers: [] }
        }
      }
    };

    expect(getDeploymentLikeSpec(value)).toBe(value.spec);
  });

  test("should return pod spec when value is a ReplicaSet instance", () => {
    const value = new ReplicaSet({
      spec: {
        selector: {},
        template: {
          spec: { containers: [] }
        }
      }
    });

    expect(getDeploymentLikeSpec(value)).toBe(value.spec);
  });

  test("should return pod spec when value is a Job object", () => {
    const value = {
      apiVersion: "batch/v1",
      kind: "Job",
      spec: {
        template: {
          spec: { containers: [] }
        }
      }
    };

    expect(getDeploymentLikeSpec(value)).toBe(value.spec);
  });

  test("should return pod spec when value is a Job instance", () => {
    const value = new Job({
      spec: {
        template: {
          spec: { containers: [] }
        }
      }
    });

    expect(getDeploymentLikeSpec(value)).toBe(value.spec);
  });

  test("should return pod spec when value is a CronJob object", () => {
    const value = {
      apiVersion: "batch/v1",
      kind: "CronJob",
      spec: {
        jobTemplate: {
          spec: {
            template: {
              spec: { containers: [] }
            }
          }
        }
      }
    };

    expect(getDeploymentLikeSpec(value)).toBe(value.spec.jobTemplate.spec);
  });

  test("should return pod spec when value is a CronJob instance", () => {
    const value = new CronJob({
      spec: {
        schedule: "* * * * *",
        jobTemplate: {
          spec: {
            template: {
              spec: { containers: [] }
            }
          }
        }
      }
    });

    expect(getDeploymentLikeSpec(value)).toBe(value.spec!.jobTemplate.spec);
  });

  test("should return pod spec when value is a Rollout object", () => {
    const value = {
      apiVersion: "argoproj.io/v1alpha1",
      kind: "Rollout",
      spec: {
        template: {
          spec: { containers: [] }
        }
      }
    };

    expect(getDeploymentLikeSpec(value)).toBe(value.spec);
  });

  test("should return pod spec when value is a Rollout instance", () => {
    const value = new Rollout({
      spec: {
        template: {
          spec: { containers: [] }
        }
      }
    });

    expect(getDeploymentLikeSpec(value)).toBe(value.spec);
  });

  test("should return pod spec when value is a Knative Service object", () => {
    const value = {
      apiVersion: "serving.knative.dev/v1",
      kind: "Service",
      spec: {
        template: {
          spec: { containers: [] }
        }
      }
    };

    expect(getDeploymentLikeSpec(value)).toBe(value.spec);
  });

  test("should return pod spec when value is a Knative Service instance", () => {
    const value = new Service({
      spec: {
        template: {
          spec: { containers: [] }
        }
      }
    });

    expect(getDeploymentLikeSpec(value)).toBe(value.spec);
  });

  test("should return pod spec when value is a Knative Configuration object", () => {
    const value = {
      apiVersion: "serving.knative.dev/v1",
      kind: "Configuration",
      spec: {
        template: {
          spec: { containers: [] }
        }
      }
    };

    expect(getDeploymentLikeSpec(value)).toBe(value.spec);
  });

  test("should return pod spec when value is a Knative Configuration instance", () => {
    const value = new Configuration({
      spec: {
        template: {
          spec: { containers: [] }
        }
      }
    });

    expect(getDeploymentLikeSpec(value)).toBe(value.spec);
  });
});
