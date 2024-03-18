/// <reference types="jest-extended" />
import { ServiceAccount } from "kubernetes-models/v1/ServiceAccount";
import { createManifest, validateAll } from "../test-utils";
import rule from "./no-missing-service-account";
import { Pod } from "kubernetes-models/v1/Pod";
import { Deployment } from "kubernetes-models/apps/v1/Deployment";
import { RoleBinding } from "kubernetes-models/rbac.authorization.k8s.io/v1/RoleBinding";
import { ClusterRoleBinding } from "kubernetes-models/rbac.authorization.k8s.io/v1/ClusterRoleBinding";

test("should pass when data is undefined", () => {
  const manifest = createManifest(undefined);
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when data is an empty object", () => {
  const manifest = createManifest({});
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when service account is undefined in pod spec", () => {
  const pod = createManifest(
    new Pod({
      metadata: { name: "foo", namespace: "a" },
      spec: {
        containers: []
      }
    })
  );
  expect(validateAll(rule, undefined, [pod])).toBeEmpty();
});

test("should pass when service account is in the same namespace", () => {
  const sa = createManifest(
    new ServiceAccount({
      metadata: { name: "bar", namespace: "a" }
    })
  );
  const pod = createManifest(
    new Pod({
      metadata: { name: "foo", namespace: "a" },
      spec: {
        serviceAccount: "bar",
        containers: []
      }
    })
  );
  expect(validateAll(rule, undefined, [sa, pod])).toBeEmpty();
});

test("should report when service account does not exist in the same namespace", () => {
  const sa = createManifest(
    new ServiceAccount({
      metadata: { name: "bar", namespace: "a" }
    })
  );
  const pod = createManifest(
    new Pod({
      metadata: { name: "foo", namespace: "b" },
      spec: {
        serviceAccount: "bar",
        containers: []
      }
    })
  );
  expect(validateAll(rule, undefined, [sa, pod])).toEqual([
    {
      manifest: pod,
      message: `Service account "bar" does not exist in namespace "b".`
    }
  ]);
});

test("should report when service account does not exist", () => {
  const pod = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        serviceAccount: "bar",
        containers: []
      }
    })
  );
  expect(validateAll(rule, undefined, [pod])).toEqual([
    {
      manifest: pod,
      message: `Service account "bar" does not exist.`
    }
  ]);
});

test("should check serviceAccountName in pod spec too", () => {
  const pod = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        serviceAccountName: "bar",
        containers: []
      }
    })
  );
  expect(validateAll(rule, undefined, [pod])).toEqual([
    {
      manifest: pod,
      message: `Service account "bar" does not exist.`
    }
  ]);
});

test("should check resources containing pod spec", () => {
  const deployment = createManifest(
    new Deployment({
      metadata: { name: "foo" },
      spec: {
        selector: {},
        template: {
          spec: {
            serviceAccount: "bar",
            containers: []
          }
        }
      }
    })
  );
  expect(validateAll(rule, undefined, [deployment])).toEqual([
    {
      manifest: deployment,
      message: `Service account "bar" does not exist.`
    }
  ]);
});

test("should check role binding", () => {
  const manifest = createManifest(
    new RoleBinding({
      metadata: { name: "foo" },
      subjects: [{ kind: "ServiceAccount", name: "bar" }],
      roleRef: {
        apiGroup: "rbac.authorization.k8s.io",
        kind: "Role",
        name: "baz"
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    { manifest, message: `Service account "bar" does not exist.` }
  ]);
});

test("should check cluster role binding", () => {
  const manifest = createManifest(
    new ClusterRoleBinding({
      metadata: { name: "foo" },
      subjects: [{ kind: "ServiceAccount", name: "bar" }],
      roleRef: {
        apiGroup: "rbac.authorization.k8s.io",
        kind: "Role",
        name: "baz"
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    { manifest, message: `Service account "bar" does not exist.` }
  ]);
});

test("should pass when role binding subject is not a service account", () => {
  const manifest = createManifest(
    new RoleBinding({
      metadata: { name: "foo" },
      subjects: [{ kind: "User", name: "bar" }],
      roleRef: {
        apiGroup: "rbac.authorization.k8s.io",
        kind: "Role",
        name: "baz"
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when role binding subject apiGroup is not empty", () => {
  const manifest = createManifest(
    new RoleBinding({
      metadata: { name: "foo" },
      subjects: [{ kind: "ServiceAccount", name: "bar", apiGroup: "a" }],
      roleRef: {
        apiGroup: "rbac.authorization.k8s.io",
        kind: "Role",
        name: "baz"
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when role binding subjects is undefined", () => {
  const manifest = createManifest(
    new RoleBinding({
      metadata: { name: "foo" },
      roleRef: {
        apiGroup: "rbac.authorization.k8s.io",
        kind: "Role",
        name: "baz"
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when role binding subjects is empty", () => {
  const manifest = createManifest(
    new RoleBinding({
      metadata: { name: "foo" },
      subjects: [],
      roleRef: {
        apiGroup: "rbac.authorization.k8s.io",
        kind: "Role",
        name: "baz"
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when service account is in the allow list", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo", namespace: "xyz" },
      spec: {
        serviceAccount: "abc",
        containers: []
      }
    })
  );
  expect(
    validateAll(rule, { allow: [{ name: "a*", namespace: "x*" }] }, [manifest])
  ).toBeEmpty();
});

test(`should pass when service account name is "default"`, () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo", namespace: "a" },
      spec: {
        serviceAccount: "default",
        containers: []
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});
