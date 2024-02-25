/// <reference types="jest-extended" />
import assert from "node:assert";
import { composePlugins } from "../plugin";

describe("composePlugins", () => {
  describe("transformManifest", () => {
    test("should not set the property when no plugin has it", () => {
      const plugin = composePlugins([{}, {}]);
      expect(plugin).not.toHaveProperty("transformManifest");
    });

    test("compose functions", async () => {
      const plugins = [
        { transformManifest: jest.fn(({ data }) => (data as number) + 2) },
        { transformManifest: jest.fn(({ data }) => (data as number) + 3) }
      ];
      const plugin = composePlugins(plugins);
      assert(plugin.transformManifest);

      const actual = await plugin.transformManifest({
        path: "foo",
        index: [1, 2, 3],
        data: 1,
        issues: []
      });
      expect(actual).toEqual(6);

      for (const plugin of plugins) {
        expect(plugin.transformManifest).toHaveBeenCalledOnce();
      }

      expect(plugins[0].transformManifest).toHaveBeenCalledWith({
        path: "foo",
        index: [1, 2, 3],
        data: 1,
        issues: []
      });
      expect(plugins[1].transformManifest).toHaveBeenCalledWith({
        path: "foo",
        index: [1, 2, 3],
        data: 3,
        issues: []
      });
    });

    test("async function", async () => {
      const plugin = composePlugins([
        { transformManifest: async ({ data }) => (data as number) + 2 }
      ]);
      assert(plugin.transformManifest);

      const actual = await plugin.transformManifest({
        path: "",
        index: [],
        data: 1,
        issues: []
      });
      expect(actual).toEqual(3);
    });

    test('skips plugins without "transformManifest"', async () => {
      const plugin = composePlugins([
        { transformManifest: ({ data }) => (data as number) + 2 },
        {},
        { transformManifest: ({ data }) => (data as number) + 3 }
      ]);
      assert(plugin.transformManifest);

      const actual = await plugin.transformManifest({
        path: "",
        index: [],
        data: 1,
        issues: []
      });
      expect(actual).toEqual(6);
    });

    test("throws error when one of the function threw an error", async () => {
      const plugins = [
        { transformManifest: jest.fn(() => 1) },
        {
          transformManifest: jest.fn(() => {
            throw new Error("test error");
          })
        },
        { transformManifest: jest.fn(() => 3) }
      ];
      const plugin = composePlugins(plugins);
      assert(plugin.transformManifest);

      await expect(
        plugin.transformManifest({
          path: "",
          index: [],
          data: 1,
          issues: []
        })
      ).rejects.toThrow("test error");
      expect(plugins[0].transformManifest).toHaveBeenCalledTimes(1);
      expect(plugins[1].transformManifest).toHaveBeenCalledTimes(1);
      expect(plugins[2].transformManifest).not.toHaveBeenCalled();
    });

    test("throws error when one of the function return a rejected promise", async () => {
      const plugins = [
        { transformManifest: jest.fn(() => 1) },
        {
          transformManifest: jest.fn(() =>
            Promise.reject(new Error("test error"))
          )
        },
        { transformManifest: jest.fn(() => 3) }
      ];
      const plugin = composePlugins(plugins);
      assert(plugin.transformManifest);

      await expect(
        plugin.transformManifest({
          path: "",
          index: [],
          data: 1,
          issues: []
        })
      ).rejects.toThrow("test error");
      expect(plugins[0].transformManifest).toHaveBeenCalledTimes(1);
      expect(plugins[1].transformManifest).toHaveBeenCalledTimes(1);
      expect(plugins[2].transformManifest).not.toHaveBeenCalled();
    });

    test("stops when one of the function returns null", async () => {
      const plugins = [
        { transformManifest: jest.fn(() => 1) },
        { transformManifest: jest.fn(() => null) },
        { transformManifest: jest.fn(() => 3) }
      ];
      const plugin = composePlugins(plugins);
      assert(plugin.transformManifest);

      const actual = await plugin.transformManifest({
        path: "",
        index: [],
        data: 1,
        issues: []
      });
      expect(actual).toBeNull();
      expect(plugins[0].transformManifest).toHaveBeenCalledTimes(1);
      expect(plugins[1].transformManifest).toHaveBeenCalledTimes(1);
      expect(plugins[2].transformManifest).not.toHaveBeenCalled();
    });

    test("stops when one of the function returns undefined", async () => {
      const plugins = [
        { transformManifest: jest.fn(() => 1) },
        { transformManifest: jest.fn(() => undefined) },
        { transformManifest: jest.fn(() => 3) }
      ];
      const plugin = composePlugins(plugins);
      assert(plugin.transformManifest);

      const actual = await plugin.transformManifest({
        path: "",
        index: [],
        data: 1,
        issues: []
      });
      expect(actual).toBeUndefined();
      expect(plugins[0].transformManifest).toHaveBeenCalledTimes(1);
      expect(plugins[1].transformManifest).toHaveBeenCalledTimes(1);
      expect(plugins[2].transformManifest).not.toHaveBeenCalled();
    });
  });

  describe("validateManifest", () => {
    test("should not set the property when no plugin has it", () => {
      const plugin = composePlugins([{}, {}]);
      expect(plugin).not.toHaveProperty("validateManifest");
    });

    test("compose functions", async () => {
      const plugins = [
        { validateManifest: jest.fn() },
        { validateManifest: jest.fn() }
      ];
      const plugin = composePlugins(plugins);
      assert(plugin.validateManifest);

      const manifest = {
        path: "foo",
        index: [1, 2, 3],
        data: 1,
        issues: [],
        report() {}
      };
      await plugin.validateManifest(manifest);

      for (const plugin of plugins) {
        expect(plugin.validateManifest).toHaveBeenCalledOnce();
        expect(plugin.validateManifest).toHaveBeenCalledWith(manifest);
      }
    });

    test("async function", async () => {
      const plugin = composePlugins([{ validateManifest: async () => {} }]);
      assert(plugin.validateManifest);

      const manifest = {
        path: "",
        index: [],
        data: 1,
        issues: [],
        report() {}
      };

      await expect(plugin.validateManifest(manifest)).toResolve();
    });

    test('skips plugins without "validateManifest"', async () => {
      const plugins = [
        { validateManifest: jest.fn() },
        {},
        { validateManifest: jest.fn() }
      ];
      const plugin = composePlugins(plugins);
      assert(plugin.validateManifest);

      const manifest = {
        path: "",
        index: [],
        data: 1,
        issues: [],
        report() {}
      };
      await plugin.validateManifest(manifest);

      expect(plugins[0].validateManifest).toHaveBeenCalledOnce();
      expect(plugins[2].validateManifest).toHaveBeenCalledOnce();
    });

    test("throws error when one of the function threw an error", async () => {
      const err = new Error("test error");
      const plugins = [
        { validateManifest: jest.fn() },
        {
          validateManifest: jest.fn(() => {
            throw err;
          })
        },
        { validateManifest: jest.fn() }
      ];
      const plugin = composePlugins(plugins);
      assert(plugin.validateManifest);

      const manifest = {
        path: "",
        index: [],
        data: 1,
        issues: [],
        report() {}
      };
      await expect(plugin.validateManifest(manifest)).rejects.toThrow(err);

      expect(plugins[0].validateManifest).toHaveBeenCalledOnce();
      expect(plugins[1].validateManifest).toHaveBeenCalledOnce();
      expect(plugins[2].validateManifest).not.toHaveBeenCalled();
    });

    test("throws error when one of the function return a rejected promise", async () => {
      const err = new Error("test error");
      const plugins = [
        { validateManifest: jest.fn() },
        {
          validateManifest: jest.fn().mockRejectedValue(err)
        },
        { validateManifest: jest.fn() }
      ];
      const plugin = composePlugins(plugins);
      assert(plugin.validateManifest);

      const manifest = {
        path: "",
        index: [],
        data: 1,
        issues: [],
        report() {}
      };
      await expect(plugin.validateManifest(manifest)).rejects.toThrow(err);

      expect(plugins[0].validateManifest).toHaveBeenCalledOnce();
      expect(plugins[1].validateManifest).toHaveBeenCalledOnce();
      expect(plugins[2].validateManifest).not.toHaveBeenCalled();
    });
  });

  describe("validateAllManifests", () => {
    test("should not set the property when no plugin has it", () => {
      const plugin = composePlugins([{}, {}]);
      expect(plugin).not.toHaveProperty("validateAllManifests");
    });

    test("compose functions", async () => {
      const plugins = [
        { validateAllManifests: jest.fn() },
        { validateAllManifests: jest.fn() }
      ];
      const plugin = composePlugins(plugins);
      assert(plugin.validateAllManifests);

      const manifests = [
        {
          path: "foo",
          index: [1, 2, 3],
          data: 1,
          issues: [],
          report() {}
        }
      ];
      await plugin.validateAllManifests(manifests);

      for (const plugin of plugins) {
        expect(plugin.validateAllManifests).toHaveBeenCalledOnce();
        expect(plugin.validateAllManifests).toHaveBeenCalledWith(manifests);
      }
    });

    test("async function", async () => {
      const plugin = composePlugins([{ validateAllManifests: async () => {} }]);
      assert(plugin.validateAllManifests);

      const manifests = [
        {
          path: "",
          index: [],
          data: 1,
          issues: [],
          report() {}
        }
      ];

      await expect(plugin.validateAllManifests(manifests)).toResolve();
    });

    test('skips plugins without "validateAllManifests"', async () => {
      const plugins = [
        { validateAllManifests: jest.fn() },
        {},
        { validateAllManifests: jest.fn() }
      ];
      const plugin = composePlugins(plugins);
      assert(plugin.validateAllManifests);

      const manifests = [
        {
          path: "",
          index: [],
          data: 1,
          issues: [],
          report() {}
        }
      ];
      await plugin.validateAllManifests(manifests);

      expect(plugins[0].validateAllManifests).toHaveBeenCalledOnce();
      expect(plugins[2].validateAllManifests).toHaveBeenCalledOnce();
    });

    test("throws error when one of the function threw an error", async () => {
      const err = new Error("test error");
      const plugins = [
        { validateAllManifests: jest.fn() },
        {
          validateAllManifests: jest.fn(() => {
            throw err;
          })
        },
        { validateAllManifests: jest.fn() }
      ];
      const plugin = composePlugins(plugins);
      assert(plugin.validateAllManifests);

      const manifests = [
        {
          path: "",
          index: [],
          data: 1,
          issues: [],
          report() {}
        }
      ];
      await expect(plugin.validateAllManifests(manifests)).rejects.toThrow(err);

      expect(plugins[0].validateAllManifests).toHaveBeenCalledOnce();
      expect(plugins[1].validateAllManifests).toHaveBeenCalledOnce();
      expect(plugins[2].validateAllManifests).not.toHaveBeenCalled();
    });

    test("throws error when one of the function return a rejected promise", async () => {
      const err = new Error("test error");
      const plugins = [
        { validateAllManifests: jest.fn() },
        {
          validateAllManifests: jest.fn().mockRejectedValue(err)
        },
        { validateAllManifests: jest.fn() }
      ];
      const plugin = composePlugins(plugins);
      assert(plugin.validateAllManifests);

      const manifests = [
        {
          path: "",
          index: [],
          data: 1,
          issues: [],
          report() {}
        }
      ];
      await expect(plugin.validateAllManifests(manifests)).rejects.toThrow(err);

      expect(plugins[0].validateAllManifests).toHaveBeenCalledOnce();
      expect(plugins[1].validateAllManifests).toHaveBeenCalledOnce();
      expect(plugins[2].validateAllManifests).not.toHaveBeenCalled();
    });
  });
});
