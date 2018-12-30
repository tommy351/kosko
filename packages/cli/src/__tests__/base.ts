import { getCWD } from "../base";
import { resolve } from "path";

test("should resolve path if cwd is specified", () => {
  expect(getCWD({ cwd: "./bar" })).toEqual(resolve("./bar"));
});

test("should return the absolute path directly", () => {
  expect(getCWD({ cwd: __dirname })).toEqual(__dirname);
});

test("should return process.cwd otherwise", () => {
  expect(getCWD({})).toEqual(process.cwd());
});
