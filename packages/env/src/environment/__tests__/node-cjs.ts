/* eslint-disable @typescript-eslint/no-var-requires */
import { createNodeCJSEnvironment } from "../node-cjs";
import { join } from "node:path";
import { merge } from "../../merge";
import { Reducer } from "../../reduce";
import { Environment } from "../types";

const fixturePath = join(__dirname, "..", "..", "__fixtures__");
let env: Environment;

beforeEach(() => {
  env = createNodeCJSEnvironment({ cwd: fixturePath });
});

describe("when env is set", () => {
  describe("and exist", () => {
    let envPath: string;

    beforeEach(() => {
      env.env = "dev";
      envPath = join(fixturePath, "environments", env.env);
    });

    describe("global", () => {
      test("shold return global vars", () => {
        expect(env.global()).toEqual(require(envPath));
      });
    });

    describe("component", () => {
      test("shold return global + component vars", () => {
        expect(env.component("foo")).toEqual(
          merge([require(envPath), require(join(envPath, "foo"))])
        );
      });
    });
  });

  describe("and is ES module", () => {
    let envPath: string;

    beforeEach(() => {
      env.env = "esm";
      envPath = join(fixturePath, "environments", env.env);
    });

    describe("global", () => {
      test("shold return global vars", () => {
        expect(env.global()).toEqual(require(envPath).default);
      });
    });

    describe("component", () => {
      test("shold return global + component vars", () => {
        expect(env.component("foo")).toEqual(
          merge([
            require(envPath).default,
            require(join(envPath, "foo")).default
          ])
        );
      });
    });
  });

  describe("and not exist", () => {
    beforeEach(() => {
      env.env = "foo";
    });

    describe("global", () => {
      test("should return empty object", () => {
        expect(env.global()).toEqual({});
      });
    });

    describe("component", () => {
      test("should return empty object", () => {
        expect(env.component("foo")).toEqual({});
      });
    });
  });

  describe("and it throws an error", () => {
    beforeEach(() => {
      env.env = "error";
    });

    test("should throw the error", () => {
      expect(() => env.global()).toThrow();
    });
  });

  describe("empty folder", () => {
    beforeEach(() => {
      env.env = "empty";
    });

    describe("global", () => {
      test("should return empty object", () => {
        expect(env.global()).toEqual({});
      });
    });

    describe("component", () => {
      test("should return empty object", () => {
        expect(env.component("foo")).toEqual({});
      });
    });
  });

  describe("folder without index file", () => {
    beforeEach(() => {
      env.env = "without-index";
    });

    describe("global", () => {
      test("should return empty object", () => {
        expect(env.global()).toEqual({});
      });
    });

    describe("component", () => {
      test("should return empty object", () => {
        expect(env.component("foo")).toEqual({});
      });
    });
  });

  describe("with custom paths", () => {
    beforeEach(() => {
      env.env = "dev";
    });

    describe("global", () => {
      beforeEach(() => {
        env.paths.global = "foo/#{environment}";
      });

      test("should load from custom path", () => {
        expect(env.global()).toEqual(
          require(join(fixturePath, "foo", env.env as string))
        );
      });
    });

    describe("component", () => {
      beforeEach(() => {
        env.paths.component = "foo/#{component}/#{environment}";
      });

      test("should load from custom path", () => {
        expect(env.component("bar")).toEqual(
          require(join(fixturePath, "foo", "bar", env.env as string))
        );
      });
    });
  });

  describe("with additional reducers", () => {
    let envPath: string;

    const customReducer: Reducer = {
      name: "custom",
      reduce(variables, componentName) {
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
      test("shold return global vars", () => {
        expect(env.global()).toEqual({
          ...require(envPath),
          global: "overridden"
        });
      });
    });

    describe("component", () => {
      test("shold return global + component vars", () => {
        expect(env.component("foo")).toEqual({
          ...merge([require(envPath), require(join(envPath, "foo"))]),
          foo: "overridden"
        });
      });
    });
  });

  describe("with reducers reset", () => {
    let envPath: string;

    const customReducer: Reducer = {
      name: "custom",
      reduce(variables, componentName) {
        variables[componentName || "global"] = "overridden";
        return variables;
      }
    };

    beforeEach(() => {
      env.env = "dev";
      envPath = join(fixturePath, "environments", env.env);
      env.setReducers((reducers) => reducers.concat(customReducer));
      env.resetReducers();
    });

    describe("global", () => {
      test("shold return only global vars", () => {
        expect(env.global()).toEqual(require(envPath));
      });
    });

    describe("component", () => {
      test("shold return global + component vars", () => {
        expect(env.component("foo")).toEqual(
          merge([require(envPath), require(join(envPath, "foo"))])
        );
      });
    });
  });
});

describe("when env is an array", () => {
  describe("and is empty", () => {
    beforeEach(() => {
      env.env = [];
    });

    describe("global", () => {
      test("should return empty object", () => {
        expect(env.global()).toEqual({});
      });
    });

    describe("component", () => {
      test("should return empty object", () => {
        expect(env.component("foo")).toEqual({});
      });
    });
  });

  describe("and is not empty", () => {
    let envPath: string;

    beforeEach(() => {
      env.env = ["base", "dev"];
      envPath = join(fixturePath, "environments");
    });

    describe("global", () => {
      test("should merge global vars of specified envs", () => {
        expect(env.global()).toEqual(
          merge([require(join(envPath, "base")), require(join(envPath, "dev"))])
        );
      });
    });

    describe("component", () => {
      test("should merge global + component vars of specified envs", () => {
        expect(env.component("foo")).toEqual(
          merge([
            require(join(envPath, "base")),
            require(join(envPath, "dev")),
            require(join(envPath, "base", "foo")),
            require(join(envPath, "dev", "foo"))
          ])
        );
      });
    });
  });
});

describe("when env is unset", () => {
  describe("global", () => {
    test("should return empty object", () => {
      expect(env.global()).toEqual({});
    });
  });

  describe("component", () => {
    test("should return empty object", () => {
      expect(env.component("foo")).toEqual({});
    });
  });
});
