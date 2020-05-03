import { validate, ValidationError } from "../validate";

describe("when config is valid", () => {
  test("should pass", () => {
    expect(() => {
      validate({
        components: ["a"],
        require: ["b"],
        environments: {
          foo: {
            components: ["c"],
            require: ["d"]
          }
        }
      });
    }).not.toThrow();
  });
});

describe("when config is invalid", () => {
  test("should throw ValidationError", () => {
    expect(() => {
      validate({ require: false });
    }).toThrow(ValidationError);
  });
});
