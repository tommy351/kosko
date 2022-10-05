import { template } from "../template";

test("should return files", async () => {
  const result = await template.generate({
    name: "foo",
    image: "foo:bar",
    type: "NodePort",
    servicePort: 1234,
    containerPort: 5678,
    replicas: 3
  });

  expect(
    result.files.map((file) => ({
      ...file,
      path: file.path.replace(/\\/g, "/")
    }))
  ).toMatchSnapshot();
});
