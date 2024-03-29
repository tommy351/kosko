/// <reference types="jest-extended" />
import { RoleBinding } from "kubernetes-models/rbac.authorization.k8s.io/v1/RoleBinding";
import { createManifest, validateAll } from "../test-utils";
import rule from "./no-missing-role";
import { ClusterRoleBinding } from "kubernetes-models/rbac.authorization.k8s.io/v1/ClusterRoleBinding";
import { Role } from "kubernetes-models/rbac.authorization.k8s.io/v1/Role";
import { ClusterRole } from "kubernetes-models/rbac.authorization.k8s.io/v1/ClusterRole";

test("should pass when data is undefined", () => {
  const manifest = createManifest(undefined);
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when data is an empty object", () => {
  const manifest = createManifest({});
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when roleRef is undefined", () => {
  const manifest = createManifest(
    // @ts-expect-error
    new RoleBinding({
      metadata: { name: "test" },
      subjects: []
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when roleRef.apiGroup is empty", () => {
  const manifest = createManifest(
    new RoleBinding({
      metadata: { name: "test" },
      roleRef: { apiGroup: "", kind: "Role", name: "test" },
      subjects: []
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when roleRef.kind is empty", () => {
  const manifest = createManifest(
    new RoleBinding({
      metadata: { name: "test" },
      roleRef: {
        apiGroup: "rbac.authorization.k8s.io",
        kind: "",
        name: "test"
      },
      subjects: []
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when roleRef.name is empty", () => {
  const manifest = createManifest(
    new RoleBinding({
      metadata: { name: "test" },
      roleRef: {
        apiGroup: "rbac.authorization.k8s.io",
        kind: "Role",
        name: ""
      },
      subjects: []
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should report when role does not exist", () => {
  const manifest = createManifest(
    new RoleBinding({
      metadata: { name: "test" },
      roleRef: {
        apiGroup: "rbac.authorization.k8s.io",
        kind: "Role",
        name: "test"
      },
      subjects: []
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest,
      message: `Role "test" does not exist.`
    }
  ]);
});

test("should report when cluster role does not exist", () => {
  const manifest = createManifest(
    new RoleBinding({
      metadata: { name: "test" },
      roleRef: {
        apiGroup: "rbac.authorization.k8s.io",
        kind: "ClusterRole",
        name: "test"
      },
      subjects: []
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest,
      message: `Cluster role "test" does not exist.`
    }
  ]);
});

test("should validate ClusterRoleBinding", () => {
  const manifest = createManifest(
    new ClusterRoleBinding({
      metadata: { name: "test" },
      roleRef: {
        apiGroup: "rbac.authorization.k8s.io",
        kind: "ClusterRole",
        name: "test"
      },
      subjects: []
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest,
      message: `Cluster role "test" does not exist.`
    }
  ]);
});

test("should pass when role exists in the same namespace", () => {
  const role = createManifest(
    new Role({
      metadata: { name: "test", namespace: "a" },
      rules: []
    })
  );
  const binding = createManifest(
    new RoleBinding({
      metadata: { name: "test", namespace: "a" },
      roleRef: {
        apiGroup: "rbac.authorization.k8s.io",
        kind: "Role",
        name: "test"
      },
      subjects: []
    })
  );

  expect(validateAll(rule, undefined, [role, binding])).toBeEmpty();
});

test("should report when role does not exist in the same namespace", () => {
  const role = createManifest(
    new Role({
      metadata: { name: "test", namespace: "a" },
      rules: []
    })
  );
  const binding = createManifest(
    new RoleBinding({
      metadata: { name: "test", namespace: "b" },
      roleRef: {
        apiGroup: "rbac.authorization.k8s.io",
        kind: "Role",
        name: "test"
      },
      subjects: []
    })
  );

  expect(validateAll(rule, undefined, [role, binding])).toEqual([
    {
      manifest: binding,
      message: `Role "test" does not exist in namespace "b".`
    }
  ]);
});

test("should pass when cluster role exists in the same namespace", () => {
  const role = createManifest(
    new ClusterRole({
      metadata: { name: "test", namespace: "a" },
      rules: []
    })
  );
  const binding = createManifest(
    new RoleBinding({
      metadata: { name: "test", namespace: "a" },
      roleRef: {
        apiGroup: "rbac.authorization.k8s.io",
        kind: "ClusterRole",
        name: "test"
      },
      subjects: []
    })
  );

  expect(validateAll(rule, undefined, [role, binding])).toBeEmpty();
});

test("should pass when cluster role exists in other namespace", () => {
  const role = createManifest(
    new ClusterRole({
      metadata: { name: "test", namespace: "a" },
      rules: []
    })
  );
  const binding = createManifest(
    new RoleBinding({
      metadata: { name: "test", namespace: "b" },
      roleRef: {
        apiGroup: "rbac.authorization.k8s.io",
        kind: "ClusterRole",
        name: "test"
      },
      subjects: []
    })
  );

  expect(validateAll(rule, undefined, [role, binding])).toBeEmpty();
});

test("should pass when role is in allow list", () => {
  const binding = createManifest(
    new RoleBinding({
      metadata: { name: "test", namespace: "abc" },
      roleRef: {
        apiGroup: "rbac.authorization.k8s.io",
        kind: "Role",
        name: "xyz"
      },
      subjects: []
    })
  );

  expect(
    validateAll(
      rule,
      { allow: [{ kind: "Role", namespace: "a*", name: "x*" }] },
      [binding]
    )
  ).toBeEmpty();
});

test("should pass when cluster role is in allow list", () => {
  const binding = createManifest(
    new RoleBinding({
      metadata: { name: "test", namespace: "xyz" },
      roleRef: {
        apiGroup: "rbac.authorization.k8s.io",
        kind: "ClusterRole",
        name: "abc"
      },
      subjects: []
    })
  );

  expect(
    validateAll(rule, { allow: [{ kind: "ClusterRole", name: "a*" }] }, [
      binding
    ])
  ).toBeEmpty();
});

test(`should pass when name starts with "system:"`, () => {
  const binding = createManifest(
    new RoleBinding({
      metadata: { name: "test" },
      roleRef: {
        apiGroup: "rbac.authorization.k8s.io",
        kind: "Role",
        name: "system:foo"
      },
      subjects: []
    })
  );
  expect(validateAll(rule, undefined, [binding])).toBeEmpty();
});

describe("when role is extension-apiserver-authentication-reader", () => {
  test("should pass when namespace is kube-system", () => {
    const manifest = createManifest(
      new RoleBinding({
        metadata: { name: "test", namespace: "kube-system" },
        roleRef: {
          apiGroup: "rbac.authorization.k8s.io",
          kind: "Role",
          name: "extension-apiserver-authentication-reader"
        }
      })
    );
    expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
  });

  test("should report when namespace is not kube-system", () => {
    const manifest = createManifest(
      new RoleBinding({
        metadata: { name: "test", namespace: "foo" },
        roleRef: {
          apiGroup: "rbac.authorization.k8s.io",
          kind: "Role",
          name: "extension-apiserver-authentication-reader"
        }
      })
    );
    expect(validateAll(rule, undefined, [manifest])).toEqual([
      {
        manifest,
        message: `Role "extension-apiserver-authentication-reader" does not exist in namespace "foo".`
      }
    ]);
  });

  test("should report when namespace is undefined", () => {
    const manifest = createManifest(
      new RoleBinding({
        metadata: { name: "test" },
        roleRef: {
          apiGroup: "rbac.authorization.k8s.io",
          kind: "Role",
          name: "extension-apiserver-authentication-reader"
        }
      })
    );
    expect(validateAll(rule, undefined, [manifest])).toEqual([
      {
        manifest,
        message: `Role "extension-apiserver-authentication-reader" does not exist.`
      }
    ]);
  });
});

describe.each(["admin", "cluster-admin", "edit", "view"])(
  "when role name is %s",
  (name) => {
    test("should pass when kind is ClusterRole", () => {
      const manifest = createManifest(
        new ClusterRoleBinding({
          metadata: { name: "test" },
          roleRef: {
            apiGroup: "rbac.authorization.k8s.io",
            kind: "ClusterRole",
            name
          }
        })
      );
      expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
    });

    test("should report when kind is Role", () => {
      const manifest = createManifest(
        new RoleBinding({
          metadata: { name: "test" },
          roleRef: {
            apiGroup: "rbac.authorization.k8s.io",
            kind: "Role",
            name
          }
        })
      );
      expect(validateAll(rule, undefined, [manifest])).toEqual([
        {
          manifest,
          message: `Role "${name}" does not exist.`
        }
      ]);
    });
  }
);
