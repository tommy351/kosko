/* eslint-disable @typescript-eslint/no-var-requires */
import { join } from "node:path";
import { merge } from "../../merge";
import { Reducer } from "../../reduce";
import { createNodeESMEnvironment } from "../node-esm";
import { Environment } from "../types";

jest.mock("@kosko/require", () => {
  const pkg = jest.requireActual("@kosko/require");

  return {
    ...pkg,
    getRequireExtensions: () => [".js"]
  };
});

const fixturePath = join(__dirname, "..", "..", "__fixtures__");
let env: Environment;

beforeEach(() => {
  env = createNodeESMEnvironment({ cwd: fixturePath });
});

describe("when module exists", () => {
  let envPath: string;

  beforeEach(() => {
    env.env = "dev";
    envPath = join(fixturePath, "environments", env.env);
  });

  describe("global", () => {
    test("should return global vars", async () => {
      await expect(env.global()).resolves.toEqual(require(envPath));
    });
  });

  describe("component", () => {
    test("shold return global + component vars", async () => {
      await expect(env.component("foo")).resolves.toEqual(
        merge([require(envPath), require(join(envPath, "foo"))])
      );
    });
  });
});

describe("when module does not exist", () => {
  beforeEach(() => {
    env.env = "foo";
  });

  describe("global", () => {
    test("should return empty object", async () => {
      await expect(env.global()).resolves.toEqual({});
    });
  });

  describe("component", () => {
    test("should return empty object", async () => {
      await expect(env.component("foo")).resolves.toEqual({});
    });
  });
});

describe("when module throws an error", () => {
  beforeEach(() => {
    env.env = "error";
  });

  test("should throw the error", async () => {
    await expect(() => env.global()).rejects.toThrow();
  });
});

describe("with additional reducers", () => {
  let envPath: string;

  const customReducer: Reducer = {
    name: "custom",
    reduce: async (variables, componentName) => {
      return {
        ...variables,
        [componentName || "global"]: "overridden"
      };
    }
  };

  beforeEach(() => {
    env.env = "dev";
    envPath = join(fixturePath, "environments", env.env);
    env.setReducers((reducers) => reducers.concat(customReducer));
  });

  afterEach(() => {
    env.resetReducers();
  });

  describe("global", () => {
    test("shold return global vars", async () => {
      await expect(env.global()).resolves.toEqual({
        ...require(envPath),
        global: "overridden"
      });
    });
  });

  describe("component", () => {
    test("shold return global + component vars", async () => {
      await expect(env.component("foo")).resolves.toEqual({
        ...merge([require(envPath), require(join(envPath, "foo"))]),
        foo: "overridden"
      });
    });
  });
});

describe("when reducer throws an error", () => {
  const errorReducer: Reducer = {
    name: "error",
    reduce: () => Promise.reject(new Error("Reduce error"))
  };

  beforeEach(() => {
    env.env = "dev";
    env.setReducers((reducers) => reducers.concat(errorReducer));
  });

  afterEach(() => {
    env.resetReducers();
  });

  test("should throw the error", async () => {
    await expect(env.global()).rejects.toThrow();
  });
});
