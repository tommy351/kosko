import { migrateString } from "@kosko/migrate";
import { readDir, readFile, joinPath, getStdin } from "@kosko/system-utils";
import { Signale } from "signale";
import { setLogger } from "../../cli/command";
import { print } from "../../cli/print";
import { MigrateArguments, migrateCmd } from "../migrate";

const mockGetStdin = getStdin as jest.MockedFunction<typeof getStdin>;

jest.mock("@kosko/system-utils", () => ({
  ...(jest.requireActual("@kosko/system-utils") as any),
  getStdin: jest.fn()
}));

jest.mock("../../cli/print");

const fixturePath = joinPath(__dirname, "..", "__fixtures__");
const logger = new Signale({ disabled: true });

console.log(fixturePath);

async function execute(args: Partial<MigrateArguments>): Promise<void> {
  const ctx = setLogger({ cwd: fixturePath, ...args } as any, logger);
  await migrateCmd.handler(ctx);
}

beforeEach(() => jest.resetAllMocks());

describe(`given "-"`, () => {
  const input = `
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
spec:
  containers: []
  `;

  beforeEach(async () => {
    mockGetStdin.mockResolvedValueOnce(input);
    await execute({ filename: ["-"] });
  });

  test("should call print once", () => {
    expect(print).toHaveBeenCalledTimes(1);
  });

  test("should call print with result", async () => {
    const expected = await migrateString(input);
    expect(print).toHaveBeenCalledWith(expected);
  });
});

describe("given a file", () => {
  beforeEach(async () => {
    await execute({ filename: ["only-deployment.yaml"] });
  });

  test("should call print once", () => {
    expect(print).toHaveBeenCalledTimes(1);
  });

  test("should call print with result", async () => {
    const expected = await migrateString(
      await readFile(joinPath(fixturePath, "only-deployment.yaml"))
    );

    expect(print).toHaveBeenCalledWith(expected);
  });
});

describe("given an absolute path", () => {
  const path = joinPath(fixturePath, "only-deployment.yaml");

  beforeEach(async () => {
    await execute({ filename: [path] });
  });

  test("should call print once", () => {
    expect(print).toHaveBeenCalledTimes(1);
  });

  test("should call print with result", async () => {
    const expected = await migrateString(await readFile(path));
    expect(print).toHaveBeenCalledWith(expected);
  });
});

describe("given a directory", () => {
  beforeEach(async () => {
    await execute({ filename: [fixturePath] });
  });

  test("should call print once", () => {
    expect(print).toHaveBeenCalledTimes(1);
  });

  test("should call print with result", async () => {
    const files = await readDir(fixturePath);
    const contents = await Promise.all(
      files.map((file) => readFile(joinPath(fixturePath, file)))
    );
    const expected = await migrateString(contents.join("---\n"));
    expect(print).toHaveBeenCalledWith(expected);
  });
});

describe("given multiple files", () => {
  beforeEach(async () => {
    await execute({
      filename: ["only-deployment.yaml", "deployment-and-service.yaml"]
    });
  });

  test("should call print once", () => {
    expect(print).toHaveBeenCalledTimes(1);
  });

  test("should call print with result", async () => {
    const contents = await Promise.all(
      ["only-deployment.yaml", "deployment-and-service.yaml"].map((file) =>
        readFile(joinPath(fixturePath, file))
      )
    );
    const expected = await migrateString("---\n" + contents.join("\n"));

    expect(print).toHaveBeenCalledWith(expected);
  });
});
