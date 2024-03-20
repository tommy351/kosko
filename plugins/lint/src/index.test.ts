import plugin from "./index";
import assert from "node:assert";
import { createManifest } from "./test-utils";
import { Pod } from "kubernetes-models/v1/Pod";

function createInvalidPod() {
  return createManifest(
    new Pod({
      spec: {
        containers: [
          {
            name: "test",
            image: "test",
            volumeMounts: [{ name: "foo", mountPath: "/test" }]
          }
        ]
      }
    })
  );
}

test("should return an empty object when rules is empty", async () => {
  await expect(plugin({ cwd: "", config: { rules: {} } })).resolves.toEqual({});
});

test("should disable the rule when rule config is false", async () => {
  await expect(
    plugin({
      cwd: "",
      config: {
        rules: {
          "no-missing-pod-volume-mount": false
        }
      }
    })
  ).resolves.toEqual({});
});

test('should disable the rule when severity is "off"', async () => {
  await expect(
    plugin({
      cwd: "",
      config: {
        rules: {
          "no-missing-pod-volume-mount": { severity: "off" }
        }
      }
    })
  ).resolves.toEqual({});
});

describe.each(["error", "warning"])("when severity is %s", (severity) => {
  test("should report issues with the given severity", async () => {
    const manifest = createInvalidPod();
    const { validateManifest } = await plugin({
      cwd: "",
      config: {
        rules: {
          "no-missing-pod-volume-mount": { severity }
        }
      }
    });
    assert(typeof validateManifest === "function");
    validateManifest(manifest);
    expect(manifest.issues).toEqual([
      {
        severity,
        message:
          'no-missing-pod-volume-mount: Volume "foo" is not defined in volumes.'
      }
    ]);
  });
});

test("should set validateAllManifests when corresponding rule is enabled", async () => {
  const { validateAllManifests } = await plugin({
    cwd: "",
    config: {
      rules: {
        "no-missing-namespace": { severity: "error" }
      }
    }
  });
  assert(typeof validateAllManifests === "function");

  const manifest = createManifest(
    new Pod({
      metadata: { namespace: "test", name: "foo" }
    })
  );
  validateAllManifests([manifest]);

  expect(manifest.issues).toEqual([
    {
      severity: "error",
      message: `no-missing-namespace: Namespace "test" does not exist or is not allowed.`
    }
  ]);
});
