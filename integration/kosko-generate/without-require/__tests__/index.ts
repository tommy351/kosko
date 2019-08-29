import execa from "execa";
import { dirname, join } from "path";
import { runCLI } from "../../../run";
import symlinkDir from "symlink-dir";
import pkgDir from "pkg-dir";

const testDir = dirname(__dirname);

let args: string[];
let result: execa.ExecaReturnValue;
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

describe("when output is not set", () => {
  beforeAll(() => {
    args = ["generate", "--env", "dev"];
    options = {};
  });

  test("should return status code 0", () => {
    expect(result.exitCode).toEqual(0);
  });

  test("should output YAML", () => {
    expect(result.stdout).toMatchSnapshot();
  });
});

describe("when output = yaml", () => {
  beforeAll(() => {
    args = ["generate", "--env", "dev", "--output", "yaml"];
    options = {};
  });

  test("should return status code 0", () => {
    expect(result.exitCode).toEqual(0);
  });

  test("should output YAML", () => {
    expect(result.stdout).toMatchSnapshot();
  });
});

describe("when output = json", () => {
  beforeAll(() => {
    args = ["generate", "--env", "dev", "--output", "json"];
    options = {};
  });

  test("should return status code 0", () => {
    expect(result.exitCode).toEqual(0);
  });

  test("should output JSON", () => {
    expect(result.stdout).toMatchSnapshot();
  });
});

describe("when output is invalid", () => {
  beforeAll(() => {
    args = ["generate", "--env", "dev", "--output", "foo"];
    options = { reject: false };
  });

  test("should return status code 1", () => {
    expect(result.exitCode).toEqual(1);
  });

  test("should print the error", () => {
    expect(result.stderr).toMatchSnapshot();
  });
});
