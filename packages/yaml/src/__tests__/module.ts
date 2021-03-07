import {
  getResourceModule,
  resetResourceModules,
  setResourceModule
} from "../module";

beforeEach(() => {
  resetResourceModules();
});

describe("when the module is not registered and is in kubernetes-models", () => {
  test("should return the module", async () => {
    await expect(
      getResourceModule({ apiVersion: "v1", kind: "Pod" })
    ).resolves.toEqual({
      path: "kubernetes-models/v1/Pod",
      export: "Pod"
    });
  });
});

describe("when the module is not registered and is not in kubernetes-models", () => {
  test("should return undefined", async () => {
    await expect(
      getResourceModule({ apiVersion: "example.local/v1", kind: "Foo" })
    ).resolves.toBeUndefined();
  });
});

describe("when the module is registered", () => {
  beforeEach(() => {
    setResourceModule(
      { apiVersion: "foo", kind: "bar" },
      {
        path: "a",
        export: "b"
      }
    );
  });

  test("should return the module", async () => {
    await expect(
      getResourceModule({ apiVersion: "foo", kind: "bar" })
    ).resolves.toEqual({
      path: "a",
      export: "b"
    });
  });
});
