import { createNodeESMEnvironment } from "../../mod.ts";
import type { Environment } from "../../mod.ts";
import { path, expect } from "@test/deps.ts";

const fixturePath = path.join(
  path.fromFileUrl(import.meta.url),
  "../../../__fixtures__"
);

describe("@kosko/env environment", () => {
  let env: Environment;

  beforeEach(() => {
    env = createNodeESMEnvironment({ cwd: fixturePath });
  });

  describe("when module exists", () => {
    let envPath: string;

    beforeEach(() => {
      env.env = "esm";
      envPath = path.join(fixturePath, "environments", env.env);
    });

    describe("global", () => {
      test("should return global vars", async () => {
        await expect(env.global()).to.eventually.deep.equal({
          foo: path.toFileUrl(path.join(envPath, "index.js")).toString()
        });
      });
    });

    describe("component", () => {
      test("should return global + component vars", async () => {
        await expect(env.component("foo")).to.eventually.deep.equal({
          foo: path.toFileUrl(path.join(envPath, "index.js")).toString(),
          bar: path.toFileUrl(path.join(envPath, "foo.js")).toString()
        });
      });
    });
  });

  describe("when module does not exist", () => {
    beforeEach(() => {
      env.env = "foo";
    });

    describe("global", () => {
      test("should return empty object", async () => {
        await expect(env.global()).to.eventually.deep.equal({});
      });
    });

    describe("component", () => {
      test("should return empty object", async () => {
        await expect(env.component("foo")).to.eventually.deep.equal({});
      });
    });
  });

  describe("when module throws an error", () => {
    beforeEach(() => {
      env.env = "error";
    });

    test("should throw the error", async () => {
      await expect(env.global()).to.be.rejected;
    });
  });
});
