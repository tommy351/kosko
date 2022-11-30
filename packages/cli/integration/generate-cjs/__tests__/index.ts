import execa from "execa";
import { dirname } from "node:path";
import { runNodeCLI } from "../../utils/run";

const testDir = dirname(__dirname);

let args: string[];
let result: execa.ExecaReturnValue;
let options: execa.Options;

beforeEach(async () => {
  result = await runNodeCLI(args, {
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

describe("when multiple set arguments are provided", () => {
  beforeAll(() => {
    args = [
      "generate",
      "--env",
      "dev",
      "--set.nginx",
      "tolerations[?(@.key=='key2')].value=newValue",
      "--set.nginx",
      "image.registry=nginx.io",
      "--set",
      "image.registry=myRegistry.io",
      "--set",
      'metadata={"labels":{"app":"overridden"}}'
    ];
    options = {};
  });

  test("should return status code 0", () => {
    expect(result.exitCode).toEqual(0);
  });

  test("should output YAML", () => {
    expect(result.stdout).toMatchSnapshot();
  });
});

describe("when key in the set argument is invalid", () => {
  beforeAll(() => {
    args = [
      "generate",
      "--env",
      "dev",
      "--set.nginx",
      "tolerations[?@.key=='key2'].value=newValue"
    ];
    options = { reject: false };
  });

  test("should return status code 1", () => {
    expect(result.exitCode).toEqual(1);
  });

  test("should print the error", () => {
    expect(result.stderr).toMatchSnapshot();
  });
});

describe("when value in the set argument is invalid", () => {
  beforeAll(() => {
    args = [
      "generate",
      "--env",
      "dev",
      "--set.nginx",
      "image.registry nginx.io"
    ];
    options = { reject: false };
  });

  test("should return status code 1", () => {
    expect(result.exitCode).toEqual(1);
  });

  test("should print the error", () => {
    expect(result.stderr).toMatchSnapshot();
  });
});

describe("when nested value in the set argument is invalid", () => {
  beforeAll(() => {
    args = ["generate", "--env", "dev", "--set.nginx", "3"];
    options = { reject: false };
  });

  test("should return status code 1", () => {
    expect(result.exitCode).toEqual(1);
  });

  test("should print the error", () => {
    expect(result.stderr).toMatchSnapshot();
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
