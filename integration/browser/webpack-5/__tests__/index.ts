import { dirname, join } from "node:path";
import execa from "execa";

const testDir = dirname(__dirname);

beforeAll(async () => {
  await execa("webpack", [], {
    cwd: testDir
  });

  await page.goto(`file://${join(testDir, "index.html")}`);
});

test("should print manifests", async () => {
  const element = await expect(page).toMatchElement("pre");
  const innerTextProp = await element.getProperty("innerText");
  const innerText = await innerTextProp.jsonValue();

  expect(innerText).toMatchSnapshot();
});
