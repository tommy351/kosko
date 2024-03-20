import {
  apiVersionToGroup,
  getErrorCode,
  getManifestMeta,
  isRecord,
  toArray
} from "../index";

class Empty {}

test.each([
  { value: null, expected: false },
  { value: undefined, expected: false },
  { value: {}, expected: true },
  { value: Object.create(null), expected: true },
  {
    value: () => {
      //
    },
    expected: false
  },
  { value: [], expected: false },
  { value: "", expected: false },
  { value: true, expected: false },
  { value: 3, expected: false },
  { value: Empty, expected: false },
  { value: new Empty(), expected: true }
])("isRecord($value) -> $expected", ({ value, expected }) => {
  expect(isRecord(value)).toEqual(expected);
});

test.each([
  { value: 1, expected: [1] },
  { value: [1], expected: [1] }
])("toArray($value) -> $expected", ({ value, expected }) => {
  expect(toArray(value)).toEqual(expected);
});

test.each([
  { value: undefined, expected: undefined },
  { value: null, expected: undefined },
  { value: "", expected: undefined },
  { value: 3, expected: undefined },
  { value: true, expected: undefined },
  { value: {}, expected: undefined },
  { value: [], expected: undefined },
  { value: { foo: "bar" }, expected: undefined },
  { value: { code: "foo" }, expected: "foo" },
  { value: { code: 3 }, expected: undefined }
])("getErrorCode($value) -> $expected", ({ value, expected }) => {
  expect(getErrorCode(value)).toEqual(expected);
});

test.each([
  { apiVersion: "apps/v1", expected: "apps" },
  { apiVersion: "v1", expected: "" }
])(
  `apiVersionToGroup($apiVersion) -> $expected`,
  ({ apiVersion, expected }) => {
    expect(apiVersionToGroup(apiVersion)).toEqual(expected);
  }
);

describe("getManifestMeta", () => {
  test("returns undefined when value is undefined", () => {
    expect(getManifestMeta(undefined)).toBeUndefined();
  });

  test("returns undefined when value is an empty object", () => {
    expect(getManifestMeta({})).toBeUndefined();
  });

  test("returns undefined when apiVersion is undefined", () => {
    expect(
      getManifestMeta({ kind: "Pod", metadata: { name: "test" } })
    ).toBeUndefined();
  });

  test("returns undefined when kind is undefined", () => {
    expect(
      getManifestMeta({ apiVersion: "v1", metadata: { name: "test" } })
    ).toBeUndefined();
  });

  test("returns undefined when metadata is undefined", () => {
    expect(getManifestMeta({ apiVersion: "v1", kind: "Pod" })).toBeUndefined();
  });

  test("returns undefined when name is undefined", () => {
    expect(
      getManifestMeta({ apiVersion: "v1", kind: "Pod", metadata: {} })
    ).toBeUndefined();
  });

  test("returns metadata when all fields are defined", () => {
    expect(
      getManifestMeta({
        apiVersion: "v1",
        kind: "Pod",
        metadata: { name: "test" }
      })
    ).toEqual({
      apiVersion: "v1",
      kind: "Pod",
      name: "test"
    });
  });

  test("returns namespace when it is defined", () => {
    expect(
      getManifestMeta({
        apiVersion: "v1",
        kind: "Pod",
        metadata: { name: "test", namespace: "default" }
      })
    ).toEqual({
      apiVersion: "v1",
      kind: "Pod",
      name: "test",
      namespace: "default"
    });
  });
});
