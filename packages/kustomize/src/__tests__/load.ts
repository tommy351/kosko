import { join } from "path";
import { loadKustomize } from "../load";

const FIXTURE_DIR = join(__dirname, "../__fixtures__");

jest.setTimeout(15000);

test("local path", async () => {
  const result = loadKustomize({ path: join(FIXTURE_DIR, "hello-world") });
  await expect(result()).resolves.toMatchSnapshot();
});

test("remote url", async () => {
  const result = loadKustomize({
    path: "https://github.com/kubernetes-sigs/kustomize.git/examples/helloWorld?ref=v1.0.6"
  });

  await expect(result()).resolves.toMatchSnapshot();
});

test("helm chart", async () => {
  const result = loadKustomize({
    path: join(FIXTURE_DIR, "helm"),
    enableHelm: true
  });

  await expect(result()).resolves.toMatchSnapshot();
});
