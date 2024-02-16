/// <reference types="jest-extended" />
import assert from "node:assert";
import { composePlugins } from "../plugin";

describe("composePlugins", () => {
  describe("transformManifest", () => {
    test("should not set the property when no plugin has it", () => {
      const plugin = composePlugins([
        { validateAllManifests: () => {} },
        { validateAllManifests: () => {} }
      ]);
      expect(plugin.transformManifest).toBeUndefined();
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
        data: 1
      });
      expect(actual).toEqual(6);
      expect(plugins[0].transformManifest).toHaveBeenCalledWith({
        path: "foo",
        index: [1, 2, 3],
        data: 1
      });
      expect(plugins[1].transformManifest).toHaveBeenCalledWith({
        path: "foo",
        index: [1, 2, 3],
        data: 3
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
        data: 1
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
        data: 1
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
          data: 1
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
          data: 1
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
        data: 1
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
        data: 1
      });
      expect(actual).toBeUndefined();
      expect(plugins[0].transformManifest).toHaveBeenCalledTimes(1);
      expect(plugins[1].transformManifest).toHaveBeenCalledTimes(1);
      expect(plugins[2].transformManifest).not.toHaveBeenCalled();
    });
  });

  describe("validateAllManifests", () => {
    test("should not set the property when no plugin has it", () => {
      const plugin = composePlugins([
        { transformManifest: () => {} },
        { transformManifest: () => {} }
      ]);
      expect(plugin.validateAllManifests).toBeUndefined();
    });

    test("compose functions", async () => {
      const plugins = [
        { validateAllManifests: jest.fn() },
        { validateAllManifests: jest.fn() }
      ];
      const plugin = composePlugins(plugins);
      assert(plugin.validateAllManifests);

      const result = { manifests: [] };

      await expect(plugin.validateAllManifests(result)).toResolve();

      expect(plugins[0].validateAllManifests).toHaveBeenCalledWith(result);
      expect(plugins[1].validateAllManifests).toHaveBeenCalledWith(result);
    });

    test("async function", async () => {
      const plugin = composePlugins([{ validateAllManifests: async () => {} }]);
      assert(plugin.validateAllManifests);

      const result = { manifests: [] };

      await expect(plugin.validateAllManifests(result)).toResolve();
    });

    test('skips plugins without "validateAllManifests"', async () => {
      const plugin = composePlugins([
        { validateAllManifests: () => {} },
        {},
        { validateAllManifests: () => {} }
      ]);
      assert(plugin.validateAllManifests);

      const result = { manifests: [] };

      await expect(plugin.validateAllManifests(result)).toResolve();
    });

    test("throws error when one of the function threw an error", async () => {
      const plugins = [
        { validateAllManifests: jest.fn() },
        {
          validateAllManifests: jest.fn(() => {
            throw new Error("test error");
          })
        },
        { validateAllManifests: jest.fn() }
      ];
      const plugin = composePlugins(plugins);
      assert(plugin.validateAllManifests);

      const result = { manifests: [] };

      await expect(plugin.validateAllManifests(result)).rejects.toThrow(
        "test error"
      );
      expect(plugins[0].validateAllManifests).toHaveBeenCalledTimes(1);
      expect(plugins[1].validateAllManifests).toHaveBeenCalledTimes(1);
      expect(plugins[2].validateAllManifests).not.toHaveBeenCalled();
    });

    test("throws error when one of the function return a rejected promise", async () => {
      const plugins = [
        { validateAllManifests: jest.fn() },
        {
          validateAllManifests: jest
            .fn()
            .mockRejectedValue(new Error("test error"))
        },
        { validateAllManifests: jest.fn() }
      ];
      const plugin = composePlugins(plugins);
      assert(plugin.validateAllManifests);

      const result = { manifests: [] };

      await expect(plugin.validateAllManifests(result)).rejects.toThrow(
        "test error"
      );
      expect(plugins[0].validateAllManifests).toHaveBeenCalledTimes(1);
      expect(plugins[1].validateAllManifests).toHaveBeenCalledTimes(1);
      expect(plugins[2].validateAllManifests).not.toHaveBeenCalled();
    });
  });
});
