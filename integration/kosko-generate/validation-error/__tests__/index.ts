import execa from "execa";
import { dirname, join } from "path";
import { runCLI } from "../../../run";
import symlinkDir from "symlink-dir";
import pkgDir from "pkg-dir";

const testDir = dirname(__dirname);

let args: string[];
let result: execa.ExecaReturns;
let options: execa.Options;

beforeAll(async () => {
  const root = await pkgDir();
  await symlinkDir(
    join(root!, "packages", "env"),
    join(testDir, "node_modules", "@kosko", "env")
  );
});

beforeEach(async () => {
  result = await runCLI(args, {
    ...options,
    cwd: testDir
  });
});

describe("when validate is not set", () => {
  beforeAll(() => {
    args = ["generate"];
    options = { reject: false };
  });

  test("should return status code 1", () => {
    expect(result.code).toEqual(1);
  });

  test("should print the error", () => {
    expect(result.stderr).toMatchSnapshot();
  });
});

describe("when validate is true", () => {
  beforeAll(() => {
    args = ["generate"];
    options = { reject: false };
  });

  test("should return status code 1", () => {
    expect(result.code).toEqual(1);
  });

  test("should print the error", () => {
    expect(result.stderr).toMatchSnapshot();
  });
});

describe("when validate is false", () => {
  beforeAll(() => {
    args = ["generate", "--validate", "false"];
    options = {};
  });

  test("should return status code 0", () => {
    expect(result.code).toEqual(0);
  });

  test("should print the manifest", () => {
    expect(result.stdout).toMatchSnapshot();
  });
});
