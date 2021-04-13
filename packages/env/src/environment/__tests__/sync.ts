import { createSyncEnvironment } from "../sync";
import { Environment } from "../types";

let env: Environment;

beforeEach(() => {
  env = createSyncEnvironment();
  env.setReducers((reducers) => [
    ...reducers,
    {
      name: "a",
      reduce: (values, name) => ({ ...values, a: name || "" })
    },
    {
      name: "b",
      reduce: (values, name) => ({ ...values, b: name || "" })
    }
  ]);
});

describe("global", () => {
  test("should return global vars", () => {
    expect(env.global()).toEqual({ a: "", b: "" });
  });
});

describe("component", () => {
  test("should return component vars", () => {
    expect(env.component("foo")).toEqual({ a: "foo", b: "foo" });
  });
});
