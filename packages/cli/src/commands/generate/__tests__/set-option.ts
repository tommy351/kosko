import { parseSetOptions, createCLIEnvReducer } from "../set-option";

describe("Set Argument parser should return correct value", () => {
  test("when one string argument is passed", () => {
    expect(parseSetOptions("a=b")).toEqual([{ key: "a", value: "b" }]);
  });

  test("when several string arguments are passed", () => {
    expect(parseSetOptions(["a=b", "c=d", "e=f"])).toEqual([
      { key: "a", value: "b" },
      { key: "c", value: "d" },
      { key: "e", value: "f" }
    ]);
  });

  test("when object with single value is passed", () => {
    expect(parseSetOptions({ component: "a=b" })).toEqual([
      { componentName: "component", key: "a", value: "b" }
    ]);
  });

  test("when object with multiple values are passed", () => {
    expect(parseSetOptions({ component: ["a=b", "c=d"] })).toEqual([
      { componentName: "component", key: "a", value: "b" },
      { componentName: "component", key: "c", value: "d" }
    ]);
  });

  test("when object with multiple keys are passed", () => {
    expect(parseSetOptions({ component: "a=b", component2: "c=d" })).toEqual([
      { componentName: "component", key: "a", value: "b" },
      { componentName: "component2", key: "c", value: "d" }
    ]);
  });

  test("when object with multiple keys and values are passed", () => {
    expect(
      parseSetOptions({
        component: ["k1=v1", "k2=v2"],
        component2: ["k3=v3", "k4=v4"]
      })
    ).toEqual([
      { componentName: "component", key: "k1", value: "v1" },
      { componentName: "component", key: "k2", value: "v2" },
      { componentName: "component2", key: "k3", value: "v3" },
      { componentName: "component2", key: "k4", value: "v4" }
    ]);
  });

  test("when object with single value and several string arguments are passed", () => {
    expect(parseSetOptions([{ component: "a=b" }, "c=d", "e=f"])).toEqual([
      { componentName: "component", key: "a", value: "b" },
      { key: "c", value: "d" },
      { key: "e", value: "f" }
    ]);
  });

  test("when a number is passed as a value", () => {
    expect(parseSetOptions("a=1")).toEqual([{ key: "a", value: 1 }]);
  });

  test("when an array is passed as a value", () => {
    expect(parseSetOptions("a=[1,2,3]")).toEqual([
      { key: "a", value: [1, 2, 3] }
    ]);
  });

  test("when an object is passed as a value", () => {
    expect(parseSetOptions('a={"b": 1}')).toEqual([
      { key: "a", value: { b: 1 } }
    ]);
  });

  test("when both key and value contains `=` characters", () => {
    expect(parseSetOptions('someObj[?(@a=="b")].value[0]=a=1==2')).toEqual([
      { key: 'someObj[?(@a=="b")].value[0]', value: "a=1==2" }
    ]);
  });
});

describe("Set Argument parser should throw an error", () => {
  test("when invalid string argument is passed", () => {
    expect(() => parseSetOptions("a b")).toThrow(
      'Cannot parse string "a b". Expected format is "<key>=<value>".'
    );
  });

  test("when non-string argument is passed", () => {
    expect(() => parseSetOptions(1)).toThrow(
      'The specified value "1" is not a string.'
    );
  });
});

describe("CLI Variables Env Reducer", () => {
  test("should override global variables", () => {
    const target = { key: 1 };
    const reducer = createCLIEnvReducer([{ key: "key", value: "value" }]);
    reducer.reduce(target);
    expect(target.key).toEqual("value");
  });

  test("should override component variables", () => {
    const target = { key: 1 };
    const reducer = createCLIEnvReducer([
      { key: "key", value: "value", componentName: "comp" }
    ]);
    reducer.reduce(target, "comp");
    expect(target.key).toEqual("value");
  });

  test("should override global variables before the component variables", () => {
    const target = { key: 1 };
    const reducer = createCLIEnvReducer([
      { key: "key", value: "local", componentName: "comp" },
      { key: "key", value: "global" }
    ]);
    reducer.reduce(target, "comp");
    expect(target.key).toEqual("local");
  });

  test("should override component variables after the global variables", () => {
    const target = { key: 1 };
    const reducer = createCLIEnvReducer([
      { key: "key", value: "global" },
      { key: "key", value: "local", componentName: "comp" }
    ]);
    reducer.reduce(target, "comp");
    expect(target.key).toEqual("local");
  });

  test("should ignore component variables in the global context", () => {
    const target = { key: 1 };
    const reducer = createCLIEnvReducer([
      { key: "key", value: "global" },
      { key: "key", value: "local", componentName: "comp" }
    ]);
    reducer.reduce(target);
    expect(target.key).toEqual("global");
  });

  test("should set variables by JSON path", () => {
    const target = {
      phoneNumbers: [
        {
          type: "iPhone",
          number: "0123-4567-8888"
        },
        {
          type: "home",
          number: "0123-4567-8910"
        }
      ]
    };
    const expected = {
      phoneNumbers: [
        {
          type: "iPhone",
          number: "0123-4567-8888"
        },
        {
          type: "home",
          number: "newHomeNumber"
        }
      ]
    };
    const reducer = createCLIEnvReducer([
      { key: "phoneNumbers[?(@.type=='home')].number", value: "newHomeNumber" }
    ]);
    expect(reducer.reduce(target)).toEqual(expected);
  });

  test("should fail on incorrect JSON path", () => {
    expect(() =>
      createCLIEnvReducer([
        { key: "phoneNumbers[?@.type=='home'].number", value: "newHomeNumber" }
      ])
    ).toThrowErrorMatchingSnapshot();
  });
});
