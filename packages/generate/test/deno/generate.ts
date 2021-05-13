import { generate, Result } from "../../mod.ts";
import { path, expect } from "@test/deps.ts";

interface TmpFile {
  path: string;
  content: string;
}

describe("@kosko/generate generate", () => {
  let tmpDir: string;
  let tmpFiles: TmpFile[];

  beforeEach(async () => {
    tmpDir = await Deno.makeTempDir();

    for (const file of tmpFiles) {
      const absPath = path.join(tmpDir, file.path);
      await Deno.mkdir(path.dirname(absPath), { recursive: true });
      await Deno.writeTextFile(absPath, file.content);
    }
  });

  afterEach(async () => {
    await Deno.remove(tmpDir, { recursive: true });
  });

  describe("given a wildcard pattern", () => {
    let result: Result;

    beforeEach(async () => {
      result = await generate({
        components: ["*"],
        path: tmpDir
      });
    });

    describe("and one file", () => {
      beforeAll(() => {
        tmpFiles = [{ path: "foo.js", content: "export default {foo: 'bar'}" }];
      });

      test("should load the one in the components folder", () => {
        expect(result).to.deep.equal({
          manifests: [
            {
              path: path.join(tmpDir, "foo.js"),
              index: [],
              data: { foo: "bar" }
            }
          ]
        });
      });
    });

    describe("and one folder", () => {
      beforeAll(() => {
        tmpFiles = [
          {
            path: "foo/index.js",
            content: "export default {foo: 'bar'}"
          }
        ];
      });

      test("should load the one in the components folder", () => {
        expect(result).to.deep.equal({
          manifests: [
            {
              path: path.join(tmpDir, "foo", "index.js"),
              index: [],
              data: { foo: "bar" }
            }
          ]
        });
      });
    });
  });

  describe("given a pattern without an extension", () => {
    let result: Result;

    beforeEach(async () => {
      result = await generate({
        components: ["foo"],
        path: tmpDir
      });
    });

    describe("and two JS files", () => {
      beforeAll(() => {
        tmpFiles = [
          { path: "foo.js", content: "export default {foo: 'bar'}" },
          { path: "bar.js", content: "export default {}" }
        ];
      });

      test("should load the one matching the pattern", () => {
        expect(result).to.deep.equal({
          manifests: [
            {
              path: path.join(tmpDir, "foo.js"),
              index: [],
              data: { foo: "bar" }
            }
          ]
        });
      });
    });
  });

  describe("given multiple patterns", () => {
    let result: Result;

    beforeEach(async () => {
      result = await generate({
        components: ["a*", "b*"],
        path: tmpDir
      });
    });

    describe("and three files", () => {
      beforeAll(() => {
        tmpFiles = ["a", "b", "c"].map((x) => ({
          path: `${x}.js`,
          content: `export default {value: '${x}'}`
        }));
      });

      test("should load files matching the pattern", () => {
        expect(result.manifests).to.have.deep.members([
          {
            path: path.join(tmpDir, "a.js"),
            index: [],
            data: { value: "a" }
          },
          {
            path: path.join(tmpDir, "b.js"),
            index: [],
            data: { value: "b" }
          }
        ]);
      });
    });
  });
});
