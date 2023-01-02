import { dirname } from "node:path";
import { runDenoCLI } from "../../utils/run";

// eslint-disable-next-line jest/no-disabled-tests
test.skip("should generate components", async () => {
  const result = await runDenoCLI(["generate", "--env", "dev"], {
    cwd: dirname(__dirname)
  });

  expect(result.stdout).toMatchSnapshot();
});
