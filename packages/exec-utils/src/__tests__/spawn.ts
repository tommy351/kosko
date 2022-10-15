import { join } from "node:path";
import { spawn } from "../spawn";

const FIXTURE_DIR = join(__dirname, "../__fixtures__");

test("success", async () => {
  const { stdout, stderr } = await spawn(join(FIXTURE_DIR, "success.js"), [
    "a",
    "b",
    "c"
  ]);

  expect(stdout).toEqual("stdout test\na|b|c\n");
  expect(stderr).toEqual("");
});

test("not exist", async () => {
  await expect(spawn(join(FIXTURE_DIR, "not-exist"))).rejects.toThrow("ENOENT");
});

test("error", async () => {
  const path = join(FIXTURE_DIR, "error.js");

  await expect(spawn(path, ["a", "b", "c"])).rejects.toThrow(
    [`Command failed with exit code 1: ${path} a b c`, "oops", "fine"].join(
      "\n"
    )
  );
});

test("input", async () => {
  const input = `now is ${Date.now()}`;
  const { stdout } = await spawn(join(FIXTURE_DIR, "input.js"), [], {
    input
  });

  expect(stdout).toEqual(`input test\n${input}\n`);
});
