import { createAsyncEnvironment } from "../async";
import { Environment } from "../types";

let env: Environment;

beforeEach(() => {
  env = createAsyncEnvironment();
  env.setReducers((reducers) => [
    ...reducers,
    {
      name: "a",
      reduce: async (values, name) => ({ ...values, a: name || "" })
    },
    {
      name: "b",
      reduce: async (values, name) => ({ ...values, b: name || "" })
    }
  ]);
});

describe("global", () => {
  test("should return global vars", async () => {
    await expect(env.global()).resolves.toEqual({ a: "", b: "" });
  });
});

describe("component", () => {
  test("should return component vars", async () => {
    await expect(env.component("foo")).resolves.toEqual({ a: "foo", b: "foo" });
  });
});
