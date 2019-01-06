import { Environment } from "../environment";
import { join } from "path";

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
        expect(env.component("foo")).toEqual({
          ...require(envPath),
          ...require(join(envPath, "foo"))
        });
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
        expect(env.component("foo")).toEqual({
          ...require(envPath).default,
          ...require(join(envPath, "foo")).default
        });
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
