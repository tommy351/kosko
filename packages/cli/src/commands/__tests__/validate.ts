import logger, { SilentLogWriter } from "@kosko/log";
import { generateHandler } from "../generate";
import { ValidateArguments, validateCmd } from "../validate";

jest.mock("../generate");

let args: Partial<ValidateArguments>;

async function execute(): Promise<void> {
  await validateCmd.handler(args as any);
}

beforeAll(() => {
  logger.setWriter(new SilentLogWriter());
});

describe("when validation passed", () => {
  beforeEach(async () => {
    args = {
      env: "foo",
      components: ["a", "b"],
      require: ["c", "d"]
    };

    (generateHandler as jest.Mock).mockResolvedValueOnce({});
    await execute();
  });

  test("should call generate handler once", () => {
    expect(generateHandler).toHaveBeenCalledTimes(1);
  });

  test("should call generate handler with args", () => {
    expect(generateHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        ...args,
        validate: true
      })
    );
  });
});

describe("when validation failed", () => {
  const err = new Error("validation error");

  beforeEach(() => {
    args = {};
    (generateHandler as jest.Mock).mockRejectedValueOnce(err);
  });

  test("should throw an error", async () => {
    await expect(execute()).rejects.toThrow(err);
  });
});
