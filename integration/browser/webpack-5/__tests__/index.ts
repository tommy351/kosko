import { dirname, join } from "path";
import execa from "execa";
import { installPackage } from "../../../run";

const testDir = dirname(__dirname);

beforeAll(async () => {
  // Install packages
  await installPackage(testDir, "env");
  await installPackage(testDir, "generate");

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
