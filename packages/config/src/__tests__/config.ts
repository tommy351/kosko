import { join } from "path";
import { getConfig, loadConfig, searchConfig } from "../config";
import { Config, EnvironmentConfig } from "../types";
import { ValidationError } from "../validate";

const fixturePath = join(__dirname, "..", "__fixtures__");

describe("loadConfig", () => {
  describe("when file exists", () => {
    test("should load the config", async () => {
      const config = await loadConfig(join(fixturePath, "rc", ".koskorc"));
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
        loadConfig(join(fixturePath, "invalid", ".koskorc"))
      ).rejects.toThrow(ValidationError);
    });
  });
});

describe("searchConfig", () => {
  describe("succeed", () => {
    let cwd: string;
    let config: Config;

    beforeEach(async () => {
      config = await searchConfig(cwd);
    });

    describe("when config is at .koskorc", () => {
      beforeAll(() => {
        cwd = join(fixturePath, "rc");
      });

      test("should load the config", () => {
        expect(config).toMatchSnapshot();
      });
    });

    describe("when config is in package.json", () => {
      beforeAll(() => {
        cwd = join(fixturePath, "package-json");
      });

      test("should load the config", () => {
        expect(config).toMatchSnapshot();
      });
    });

    describe("when config not found", () => {
      beforeAll(() => {
        cwd = fixturePath;
      });

      test("should return an empty object", () => {
        expect(config).toEqual({});
      });
    });
  });

  describe("failed", () => {
    describe("when config is invalid", () => {
      test("should throw ValidationError", async () => {
        const cwd = join(fixturePath, "invalid");
        await expect(searchConfig(cwd)).rejects.toThrow(ValidationError);
      });
    });
  });
});

describe("getConfig", () => {
  let input: Config;
  let result: EnvironmentConfig;

  beforeEach(() => {
    result = getConfig(input, "dev");
  });

  describe("when config is empty", () => {
    beforeAll(() => {
      input = {};
    });

    test("should return an empty config", () => {
      expect(result).toEqual({
        components: [],
        require: []
      });
    });
  });

  describe("when environments is not defined", () => {
    beforeAll(() => {
      input = {
        components: ["foo"],
        require: ["bar"]
      };
    });

    test("should return the global config", () => {
      expect(result).toEqual(input);
    });
  });

  describe("when environments is defined", () => {
    describe("and the key exists", () => {
      beforeAll(() => {
        input = {
          components: ["foo"],
          require: ["bar"],
          environments: {
            dev: {
              components: ["aaa"],
              require: ["bbb"]
            }
          }
        };
      });

      test("should return the merge of global and environment config", () => {
        expect(result).toEqual({
          components: ["foo", "aaa"],
          require: ["bar", "bbb"]
        });
      });
    });

    describe("but the key does not exist", () => {
      beforeAll(() => {
        input = {
          components: ["foo"],
          require: ["bar"],
          environments: {
            prod: {
              components: ["aaa"],
              require: ["bbb"]
            }
          }
        };
      });

      test("should return the global config", () => {
        expect(result).toEqual({
          components: ["foo"],
          require: ["bar"]
        });
      });
    });
  });
});
