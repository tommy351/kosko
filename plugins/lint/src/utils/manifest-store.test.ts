import { ManifestStore } from "./manifest-store";
import { createManifest } from "../test-utils";
import { Pod } from "kubernetes-models/v1/Pod";
import { Service } from "kubernetes-models/v1/Service";
import { Ingress } from "kubernetes-models/networking.k8s.io/v1/Ingress";
import { Certificate } from "@kubernetes-models/cert-manager/cert-manager.io/v1/Certificate";

const manifests = [
  // Resource without a namespace
  createManifest(
    new Pod({
      metadata: { name: "a" }
    })
  ),
  // Resource with a namespace
  createManifest(
    new Service({
      metadata: { name: "b", namespace: "foo" }
    })
  ),
  // Non-core API group
  createManifest(
    new Ingress({
      metadata: { name: "c" }
    })
  ),
  // Certificate
  createManifest(
    new Certificate({
      metadata: { name: "d", namespace: "foo" },
      spec: {
        secretName: "d-cert-secret",
        issuerRef: {
          name: "test"
        }
      }
    })
  ),
  // Empty object
  createManifest({})
];

let store: ManifestStore;

beforeEach(() => {
  store = new ManifestStore(manifests);
});

describe("find", () => {
  describe("apiVersion predicate", () => {
    test("should return resource when apiVersion matches", () => {
      expect(store.find({ apiVersion: "v1" })).toEqual(manifests[0]);
    });

    test("should return undefined when apiVersion does not match", () => {
      expect(store.find({ apiVersion: "v2" })).toBeUndefined();
    });
  });

  describe("kind predicate", () => {
    test("should return resource when kind matches", () => {
      expect(store.find({ kind: "Pod" })).toEqual(manifests[0]);
    });

    test("should return undefined when kind does not match", () => {
      expect(store.find({ kind: "Deployment" })).toBeUndefined();
    });
  });

  describe("namespace predicate", () => {
    test("should return resource when namespace matches", () => {
      expect(store.find({ namespace: "foo" })).toEqual(manifests[1]);
    });

    test("should return resource when namespace is undefined", () => {
      expect(store.find({ namespace: undefined })).toEqual(manifests[0]);
    });

    test("should return undefined when namespace does not match", () => {
      expect(store.find({ namespace: "bar" })).toBeUndefined();
    });
  });

  describe("name predicate", () => {
    test("should return resource when name matches", () => {
      expect(store.find({ name: "a" })).toEqual(manifests[0]);
    });

    test("should return undefined when name does not match", () => {
      expect(store.find({ name: "z" })).toBeUndefined();
    });
  });

  describe("apiGroup predicate", () => {
    test("should return resource when apiGroup matches", () => {
      expect(store.find({ apiGroup: "networking.k8s.io" })).toEqual(
        manifests[2]
      );
    });

    test(`should return resource when apiGroup is ""`, () => {
      expect(store.find({ apiGroup: "" })).toEqual(manifests[0]);
    });

    test("should return undefined when apiGroup does not match", () => {
      expect(store.find({ apiGroup: "apps" })).toBeUndefined();
    });
  });

  describe("certSecret predicate", () => {
    test("should return resource when certSecret matches", () => {
      expect(store.find({ certSecret: "d-cert-secret" })).toEqual(manifests[3]);
    });

    test("should return undefined when the value is certificate name instead of secret name", () => {
      expect(store.find({ certSecret: "d" })).toBeUndefined();
    });

    test("should return undefined when certSecret does not match", () => {
      expect(store.find({ certSecret: "z" })).toBeUndefined();
    });
  });

  describe("multiple predicates", () => {
    test("should return resource when all predicates match", () => {
      expect(store.find({ apiVersion: "v1", kind: "Pod" })).toEqual(
        manifests[0]
      );
    });

    test("should return undefined when any predicate does not match", () => {
      expect(store.find({ apiVersion: "v2", kind: "Pod" })).toBeUndefined();
    });
  });
});

describe("forEach", () => {
  test("should iterate over all manifests", () => {
    const callback = jest.fn();
    store.forEach(callback);
    expect(callback).toHaveBeenCalledTimes(manifests.length);

    for (let i = 0; i < manifests.length; i++) {
      expect(callback).toHaveBeenNthCalledWith(i + 1, manifests[i]);
    }
  });
});
