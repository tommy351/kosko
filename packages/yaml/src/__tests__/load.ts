import { loadFile } from "../load";
import tmp from "tmp-promise";
import tempDir from "temp-dir";
import fs from "fs";
import { promisify } from "util";
import { join } from "path";

const writeFile = promisify(fs.writeFile);

describe("loadFile", () => {
  let tmpDir: tmp.DirectoryResult;
  let content: string;
  let result: () => Promise<readonly unknown[]>;

  beforeEach(async () => {
    tmpDir = await tmp.dir({ tmpdir: tempDir, unsafeCleanup: true });
    const path = join(tmpDir.path, "test.yaml");
    await writeFile(path, content);
    result = loadFile(path);
  });

  afterEach(async () => {
    await tmpDir.cleanup();
  });

  describe("given a valid Kubernetes object", () => {
    beforeAll(() => {
      content = `
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
`.trim();
    });

    test("should returns an async function which returns an array of objects", async () => {
      await expect(result()).resolves.toEqual([
        {
          apiVersion: "v1",
          kind: "Pod",
          metadata: { name: "test-pod" }
        }
      ]);
    });
  });

  describe("given empty objects in YAML", () => {
    beforeAll(() => {
      content = `
---
---
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
---
---
`.trim();
    });

    test("should filter nulls", async () => {
      await expect(result()).resolves.toEqual([
        {
          apiVersion: "v1",
          kind: "Pod",
          metadata: { name: "test-pod" }
        }
      ]);
    });
  });

  describe("given a non-object", () => {
    beforeAll(() => {
      content = `"foo"`;
    });

    test("should throw an error", async () => {
      await expect(result()).rejects.toThrowError(
        `The value must be an object: "foo"`
      );
    });
  });

  describe("given an array", () => {
    beforeAll(() => {
      content = `[1]`;
    });

    test("should throw an error", async () => {
      await expect(result()).rejects.toThrowError(
        `The value must be an object: [1]`
      );
    });
  });

  describe("given an object without apiVersion", () => {
    beforeAll(() => {
      content = `foo: bar`;
    });

    test("should throw an error", async () => {
      await expect(result()).rejects.toThrowError(
        `apiVersion and kind are required: {"foo":"bar"}`
      );
    });
  });

  describe("given an object with empty apiVersion", () => {
    beforeAll(() => {
      content = `apiVersion: ""`;
    });

    test("should throw an error", async () => {
      await expect(result()).rejects.toThrowError(
        `apiVersion and kind are required: {"apiVersion":""}`
      );
    });
  });

  describe("given an object without kind", () => {
    beforeAll(() => {
      content = `apiVersion: v1`;
    });

    test("should throw an error", async () => {
      await expect(result()).rejects.toThrowError(
        `apiVersion and kind are required: {"apiVersion":"v1"}`
      );
    });
  });

  describe("given an object with empty kind", () => {
    beforeAll(() => {
      content = `{apiVersion: v1, kind: ""}`;
    });

    test("should throw an error", async () => {
      await expect(result()).rejects.toThrowError(
        `apiVersion and kind are required: {"apiVersion":"v1","kind":""}`
      );
    });
  });
});
