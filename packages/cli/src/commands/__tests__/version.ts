import { versionCmd } from "../version";

jest.spyOn(global.console, "log").mockImplementation(() => {
  // discard logs
});

beforeEach(async () => {
  await versionCmd.exec({} as any, []);
});

test("should print version to console", async () => {
  expect(global.console.log).toHaveBeenCalledWith(
    require("../../../package.json").version
  );
});
