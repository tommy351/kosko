import parser, { DetailedArguments } from "yargs-parser";
import { unparse } from "../unparse";

let inputArgv: string[];
let detail: DetailedArguments;
let parseOptions: parser.Options;
let outputArgv: string[];

beforeEach(() => {
  detail = parser.detailed(inputArgv, parseOptions);
  outputArgv = unparse(detail);
});

describe("basic", () => {
  beforeAll(() => {
    parseOptions = {};
    inputArgv = ["foo", "--foo", "bar", "-a", "3"];
  });

  test("should be unparsed", () => expect(outputArgv).toEqual(inputArgv));
});

describe("negative booleans", () => {
  beforeAll(() => {
    parseOptions = {};
    inputArgv = ["--no-color"];
  });

  test("should be unparsed", () => expect(outputArgv).toEqual(inputArgv));
});

describe("ending --", () => {
  beforeAll(() => {
    parseOptions = { configuration: { "populate--": true } };
    inputArgv = ["foo", "--", "a", "b", "c"];
  });

  test("should be unparsed", () => expect(outputArgv).toEqual(inputArgv));
});

describe("alias", () => {
  beforeAll(() => {
    parseOptions = { alias: { output: "o" } };
    inputArgv = ["-o", "foo"];
  });

  test("should be unparsed", () => expect(outputArgv).toEqual(inputArgv));
});

describe("multiple aliases", () => {
  beforeAll(() => {
    parseOptions = { alias: { environment: ["e", "env"] } };
    inputArgv = ["--env", "foo"];
  });

  test("should be unparsed", () => expect(outputArgv).toEqual(inputArgv));
});

describe("camel case", () => {
  beforeAll(() => {
    parseOptions = {};
    inputArgv = ["--foo-bar", "test"];
  });

  test("should be unparsed", () => expect(outputArgv).toEqual(inputArgv));
});

describe("nested object", () => {
  beforeAll(() => {
    parseOptions = {};
    inputArgv = ["--foo.bar", "test"];
  });

  test("should be unparsed", () => expect(outputArgv).toEqual(inputArgv));
});
