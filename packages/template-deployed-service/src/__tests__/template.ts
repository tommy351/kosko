import { template, Options } from "../template";

async function generate(options: Partial<Options> = {}) {
  const result = await template.generate({
    name: "foo",
    image: "foo:bar",
    type: "NodePort",
    servicePort: 1234,
    containerPort: 5678,
    replicas: 3,
    esm: false,
    ...options
  });

  return result.files.map((file) => ({
    ...file,
    path: file.path.replace(/\\/g, "/")
  }));
}

describe("when esm = false", () => {
  test("should return files in CJS format", async () => {
    await expect(generate({ esm: false })).resolves.toMatchSnapshot();
  });
});

describe("when esm = true", () => {
  test("should return files in ESM format", async () => {
    await expect(generate({ esm: true })).resolves.toMatchSnapshot();
  });
});
