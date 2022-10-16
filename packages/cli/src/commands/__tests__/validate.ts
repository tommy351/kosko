import { handler } from "../generate/worker";
import { ValidateArguments, validateCmd } from "../validate";
import { loadConfig } from "../generate/config";

jest.mock("@kosko/log");
jest.mock("../generate/worker");
jest.mock("../generate/config");

const mockedHandler = jest.mocked(handler);
const mockedLoadConfig = jest.mocked(loadConfig);
let args: Partial<ValidateArguments>;

async function execute(): Promise<void> {
  await validateCmd.handler(args as any);
}

beforeEach(() => {
  mockedLoadConfig.mockResolvedValue({} as any);
});

describe("when validation passed", () => {
  beforeEach(async () => {
    args = {
      env: "foo",
      components: ["a", "b"],
      require: ["c", "d"]
    };

    mockedHandler.mockResolvedValueOnce();
    await execute();
  });

  test("should call generate handler once", () => {
    expect(mockedHandler).toHaveBeenCalledTimes(1);
  });

  test("should call generate handler with args", () => {
    expect(mockedHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        config: {},
        args: {
          ...args,
          validate: true
        }
      })
    );
  });
});

describe("when validation failed", () => {
  const err = new Error("validation error");

  beforeEach(() => {
    args = {};
    mockedHandler.mockRejectedValueOnce(err);
  });

  test("should throw an error", async () => {
    await expect(execute()).rejects.toThrow(err);
  });
});
