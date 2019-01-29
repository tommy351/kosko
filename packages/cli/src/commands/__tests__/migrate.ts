import { migrateCmd, MigrateArguments } from "../migrate";
import { join } from "path";
import { Signale } from "signale";
import { setLogger } from "../../cli/command";
import { print } from "../../cli/print";
import fs from "fs";
import { promisify } from "util";
import { migrateString } from "@kosko/migrate";

jest.mock("get-stdin");
jest.mock("../../cli/print");

const readFile = promisify(fs.readFile);
const fixturePath = join(__dirname, "..", "__fixtures__");
const logger = new Signale({ disabled: true });

async function execute(args: Partial<MigrateArguments>) {
  const ctx = setLogger({ cwd: fixturePath, ...args } as any, logger);
  await migrateCmd.handler(ctx);
}

beforeEach(() => jest.resetAllMocks());

describe(`given "-"`, () => {
  //
});

describe("given a file", () => {
  beforeEach(async () => {
    await execute({ filename: ["only-deployment.yaml"] });
  });

  test("should call print once", () => {
    expect(print).toHaveBeenCalledTimes(1);
  });

  test("should call print with result", async () => {
    const expected = migrateString(
      await readFile(join(fixturePath, "only-deployment.yaml"), "utf8")
    );

    expect(print).toHaveBeenCalledWith(expected);
  });
});

describe("given a directory", () => {
  //
});

describe("given mixed inputs", () => {
  //
});
