import { dirname } from "node:path";
import { runDenoCLI } from "../../utils/run";

test("should generate components", async () => {
  const result = await runDenoCLI(["generate"], {
    cwd: dirname(__dirname)
  });

  expect(result.stdout).toMatchSnapshot();
});
