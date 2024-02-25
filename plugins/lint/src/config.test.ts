import { ConfigError } from "@kosko/plugin";
import { validateConfig } from "./config";

test("should throw an error when config is undefined", () => {
  expect(() => validateConfig(undefined)).toThrow(ConfigError);
});

test("should throw an error when rule name is unknown", () => {
  expect(() =>
    validateConfig({ rules: { foobar: { severity: "error" } } })
  ).toThrow(ConfigError);
});

test("should throw an error when severity is invalid", () => {
  expect(() =>
    validateConfig({
      rules: {
        "no-missing-pod-volume-mount": { severity: "foobar" }
      }
    })
  ).toThrow(ConfigError);
});

test("should throw an error when rule config is invalid", () => {
  expect(() =>
    validateConfig({
      rules: {
        "no-missing-namespace": { config: { foo: "bar" } }
      }
    })
  ).toThrow(ConfigError);
});

test("should throw an error when rule config is set on a rule that does not accept it", () => {
  expect(() =>
    validateConfig({
      rules: {
        "no-missing-pod-volume-mount": { config: {} }
      }
    })
  ).toThrow(ConfigError);
});
