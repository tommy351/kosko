import { join } from "node:path";
import { getConfig, loadConfig, searchConfig } from "../config";
import { ValidationError } from "../validate";

const fixturePath = join(__dirname, "..", "__fixtures__");

describe("loadConfig", () => {
  describe("when file exists", () => {
    test("should load the config", async () => {
      const config = await loadConfig(join(fixturePath, "toml", "kosko.toml"));
      expect(config).toMatchSnapshot();
    });
  });

  describe("when file does not exist", () => {
    test("should throw an error", async () => {
      await expect(loadConfig(join(fixturePath, "nowhere"))).rejects.toThrow(
        "ENOENT"
      );
    });
  });

  describe("when config is invalid", () => {
    test("should throw ValidationError", async () => {
      await expect(
        loadConfig(join(fixturePath, "invalid", "kosko.toml"))
      ).rejects.toThrow(ValidationError);
    });
  });
});

describe("searchConfig", () => {
  test("should return the config when kosko.toml exists", async () => {
    const config = await searchConfig(join(fixturePath, "toml"));
    expect(config).toMatchSnapshot();
  });

  test("should return an empty object when kosko.toml does not exist", async () => {
    const config = await searchConfig(join(fixturePath, "nowhere"));
    expect(config).toEqual({});
  });

  test("should throw ValidationError when config is invalid", async () => {
    const cwd = join(fixturePath, "invalid");
    await expect(searchConfig(cwd)).rejects.toThrow(ValidationError);
  });
});

describe("getConfig", () => {
  test("should return an empty config when config is empty", () => {
    expect(getConfig({}, "dev")).toEqual({
      components: [],
      require: [],
      loaders: []
    });
  });

  test("should return the global config when env is not defined", () => {
    const input = {
      components: ["foo"],
      require: ["bar"],
      loaders: ["baz"]
    };

    expect(getConfig(input, "dev")).toEqual(input);
  });

  test("should return the global config when env is defined but the key does not exist", () => {
    const globalConf = {
      components: ["foo"],
      require: ["bar"],
      loaders: ["baz"]
    };
    const input = {
      ...globalConf,
      environments: {
        prod: {
          components: ["aaa"],
          require: ["bbb"],
          loaders: ["ccc"]
        }
      }
    };

    expect(getConfig(input, "dev")).toEqual(globalConf);
  });

  test("should return the merge of global and environment config when env is defined and the key exists", () => {
    const input = {
      components: ["foo"],
      require: ["bar"],
      loaders: ["baz"],
      environments: {
        dev: {
          components: ["aaa"],
          require: ["bbb"],
          loaders: ["ccc"]
        }
      }
    };

    expect(getConfig(input, "dev")).toEqual({
      components: ["foo", "aaa"],
      require: ["bar", "bbb"],
      loaders: ["baz", "ccc"]
    });
  });

  test("should return the merge of multiple envs when env is an array", () => {
    const input = {
      components: ["foo"],
      require: ["bar"],
      loaders: ["baz"],
      environments: {
        a: {
          components: ["aa"],
          require: ["ab"],
          loaders: ["ac"]
        },
        c: {
          components: ["ca"],
          require: ["cb"],
          loaders: ["cc"]
        }
      }
    };

    expect(getConfig(input, ["a", "b", "c"])).toEqual({
      components: ["foo", "aa", "ca"],
      require: ["bar", "ab", "cb"],
      loaders: ["baz", "ac", "cc"]
    });
  });
});
