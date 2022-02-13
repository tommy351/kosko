import { migrateString } from "@kosko/migrate";
import fs from "fs";
import getStdin from "get-stdin";
import { join } from "path";
import { print } from "../../cli/print";
import { MigrateArguments, migrateCmd } from "../migrate";

jest.mock("@kosko/log");
jest.mock("get-stdin");
jest.mock("../../cli/print");

const fixturePath = join(__dirname, "..", "__fixtures__");

async function execute(args: Partial<MigrateArguments>): Promise<void> {
  await migrateCmd.handler({ cwd: fixturePath, ...args } as any);
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
    (getStdin as any as jest.Mock).mockResolvedValueOnce(input);
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
      await fs.promises.readFile(
        join(fixturePath, "only-deployment.yaml"),
        "utf8"
      )
    );

    expect(print).toHaveBeenCalledWith(expected);
  });
});

describe("given an absolute path", () => {
  const path = join(fixturePath, "only-deployment.yaml");

  beforeEach(async () => {
    await execute({ filename: [path] });
  });

  test("should call print once", () => {
    expect(print).toHaveBeenCalledTimes(1);
  });

  test("should call print with result", async () => {
    const expected = await migrateString(
      await fs.promises.readFile(path, "utf8")
    );
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
    const files = await fs.promises.readdir(fixturePath);
    const contents = await Promise.all(
      files.map((file) => fs.promises.readFile(join(fixturePath, file), "utf8"))
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
        fs.promises.readFile(join(fixturePath, file), "utf8")
      )
    );
    const expected = await migrateString("---\n" + contents.join("\n"));

    expect(print).toHaveBeenCalledWith(expected);
  });
});
