import { generate, print, PrintFormat } from "@kosko/generate";
import { join } from "path";
import { Signale } from "signale";
import { setLogger } from "../../cli/command";
import { generateCmd } from "../generate";

jest.mock("@kosko/generate");

const logger = new Signale({ disabled: true });

beforeEach(async () => {
  jest.resetAllMocks();

  const args = setLogger(
    {
      env: "foo",
      cwd: process.cwd(),
      components: ["*"],
      output: PrintFormat.YAML
    } as any,
    logger
  );

  await generateCmd.handler(args);
});

test("should call generate once", () => {
  expect(generate).toHaveBeenCalledTimes(1);
});

test("should call generate with args", () => {
  expect(generate).toHaveBeenCalledWith({
    path: join(process.cwd(), "components"),
    components: ["*"]
  });
});

test("should call print once", () => {
  expect(print).toHaveBeenCalledTimes(1);
});

test("should call print with args", () => {
  expect(print).toHaveBeenCalledWith(undefined, {
    format: PrintFormat.YAML,
    writer: process.stdout
  });
});
