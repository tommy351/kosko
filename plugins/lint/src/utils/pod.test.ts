import { Pod } from "kubernetes-models/v1/Pod";
import { getPodSpec } from "./pod";
import { ReplicationController } from "kubernetes-models/v1/ReplicationController";
import { Deployment } from "kubernetes-models/apps/v1/Deployment";
import { StatefulSet } from "kubernetes-models/apps/v1/StatefulSet";
import { DaemonSet } from "kubernetes-models/apps/v1/DaemonSet";
import { ReplicaSet } from "kubernetes-models/apps/v1/ReplicaSet";
import { Job } from "kubernetes-models/batch/v1/Job";
import { CronJob } from "kubernetes-models/batch/v1/CronJob";

describe("getPodSpec", () => {
  test("should return undefined when value is undefined", () => {
    expect(getPodSpec(undefined)).toBeUndefined();
  });

  test("should return undefined when value is null", () => {
    expect(getPodSpec(null)).toBeUndefined();
  });

  test("should return undefined when value is not an object", () => {
    expect(getPodSpec("test")).toBeUndefined();
  });

  test("should return pod spec when value is a Pod object", () => {
    const pod = {
      apiVersion: "v1",
      kind: "Pod",
      spec: { containers: [] }
    };

    expect(getPodSpec(pod)).toBe(pod.spec);
  });

  test("should return pod spec when value is a Pod instance", () => {
    const pod = new Pod({
      spec: { containers: [] }
    });

    expect(getPodSpec(pod)).toBe(pod.spec);
  });

  test("should return undefined when value is a resource of another kind", () => {
    const value = {
      apiVersion: "v1",
      kind: "Service",
      spec: { ports: [] }
    };

    expect(getPodSpec(value)).toBeUndefined();
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

    expect(getPodSpec(value)).toBe(value.spec.template.spec);
  });

  test("should return pod spec when value is a ReplicationController instance", () => {
    const value = new ReplicationController({
      spec: {
        template: {
          spec: { containers: [] }
        }
      }
    });

    expect(getPodSpec(value)).toBe(value.spec!.template!.spec);
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

    expect(getPodSpec(value)).toBe(value.spec.template.spec);
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

    expect(getPodSpec(value)).toBe(value.spec!.template!.spec);
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

    expect(getPodSpec(value)).toBe(value.spec.template.spec);
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

    expect(getPodSpec(value)).toBe(value.spec!.template!.spec);
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

    expect(getPodSpec(value)).toBe(value.spec.template.spec);
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

    expect(getPodSpec(value)).toBe(value.spec!.template!.spec);
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

    expect(getPodSpec(value)).toBe(value.spec.template.spec);
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

    expect(getPodSpec(value)).toBe(value.spec!.template!.spec);
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

    expect(getPodSpec(value)).toBe(value.spec.template.spec);
  });

  test("should return pod spec when value is a Job instance", () => {
    const value = new Job({
      spec: {
        template: {
          spec: { containers: [] }
        }
      }
    });

    expect(getPodSpec(value)).toBe(value.spec!.template!.spec);
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

    expect(getPodSpec(value)).toBe(value.spec.jobTemplate.spec.template.spec);
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

    expect(getPodSpec(value)).toBe(value.spec!.jobTemplate.spec!.template.spec);
  });
});
