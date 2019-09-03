/* eslint-disable @typescript-eslint/no-var-requires */
import { Environment, VariablesLayer } from "../environment";
import { join } from "path";
import { merge } from "../merge";

const fixturePath = join(__dirname, "..", "__fixtures__");
let env: Environment;

beforeEach(() => {
  env = new Environment(fixturePath);
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
          merge(require(envPath), require(join(envPath, "foo")))
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
          merge(require(envPath).default, require(join(envPath, "foo")).default)
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
          require(join(fixturePath, "foo", env.env!))
        );
      });
    });

    describe("component", () => {
      beforeEach(() => {
        env.paths.component = "foo/#{component}/#{environment}";
      });

      test("should load from custom path", () => {
        expect(env.component("bar")).toEqual(
          require(join(fixturePath, "foo", "bar", env.env!))
        );
      });
    });
  });

  describe("with custom variables layer", () => {
    let envPath: string;

    const customVariablesLayer: VariablesLayer = (variables, componentName) => {
      variables[componentName || "global"] = "overridden";
      return variables;
    };

    beforeEach(() => {
      env.env = "dev";
      envPath = join(fixturePath, "environments", env.env);
      env.addVariablesLayer(customVariablesLayer);
    });

    afterEach(() => {
      env.removeVariablesLayer(customVariablesLayer);
    })

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
          ...merge(require(envPath), require(join(envPath, "foo"))),
          foo: "overridden"
        });
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
