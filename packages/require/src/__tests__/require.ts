import { requireDefault } from "../require";

jest.mock("fake-module", () => ({ module: "commonjs" }), { virtual: true });
jest.mock(
  "fake-module-es",
  () => ({
    __esModule: true,
    default: { module: "es" }
  }),
  { virtual: true }
);

let id: string;
let result: any;

beforeEach(() => {
  result = requireDefault(id);
});

describe("when require a CommonJS module", () => {
  beforeAll(() => {
    id = "fake-module";
  });

  test("should return the module directly", () => {
    expect(result).toEqual({ module: "commonjs" });
  });
});

describe("when require a ES module", () => {
  beforeAll(() => {
    id = "fake-module-es";
  });

  test("should return the module directly", () => {
    expect(result).toEqual({ module: "es" });
  });
});
