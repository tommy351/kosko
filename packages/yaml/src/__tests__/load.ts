import { loadFile, loadUrl } from "../load";
import tmp from "tmp-promise";
import tempDir from "temp-dir";
import fs from "fs";
import { promisify } from "util";
import { join } from "path";
import fetch from "node-fetch";
import type { FetchMockStatic } from "fetch-mock";

// eslint-disable-next-line @typescript-eslint/no-var-requires
jest.mock("node-fetch", () => require("fetch-mock").sandbox());

const fetchMock = (fetch as unknown) as FetchMockStatic;
const writeFile = promisify(fs.writeFile);

afterEach(() => {
  fetchMock.reset();
});

function testLoad(options: {
  setup: (content: string) => Promise<void>;
  load: () => () => Promise<readonly unknown[]>;
}) {
  let content: string;
  let result: ReturnType<typeof options["load"]>;

  beforeEach(async () => {
    await options.setup(content);
    result = options.load();
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
}

describe("loadFile", () => {
  let tmpDir: tmp.DirectoryResult;
  let path: string;

  beforeEach(async () => {
    tmpDir = await tmp.dir({ tmpdir: tempDir, unsafeCleanup: true });
    path = join(tmpDir.path, "test.yaml");
  });

  afterEach(async () => {
    await tmpDir.cleanup();
  });

  testLoad({
    setup: (content) => writeFile(path, content),
    load: () => loadFile(path)
  });
});

describe("loadUrl", () => {
  const url = "http://example.local/test.yaml";

  describe("common tests", () => {
    testLoad({
      setup: async (content) => {
        fetchMock.getOnce(url, content, {
          sendAsJson: false
        });
      },
      load: () => loadUrl(url)
    });
  });

  describe("when server responds 404", () => {
    beforeEach(() => {
      fetchMock.getOnce(url, {
        status: 404
      });
    });

    test("should throw error", async () => {
      await expect(loadUrl(url)()).rejects.toThrowError(
        `Failed to fetch YAML file from: ${url}`
      );
    });
  });

  describe("customize headers", () => {
    beforeEach(() => {
      fetchMock.mock(
        {
          url,
          headers: { Authorization: "token" },
          method: "GET"
        },
        `{apiVersion: v1, kind: Pod}`,
        {
          sendAsJson: false
        }
      );
    });

    test("should set headers to fetch", async () => {
      const result = loadUrl(url, {
        headers: { Authorization: "token" }
      });

      await expect(result()).resolves.toEqual([
        { apiVersion: "v1", kind: "Pod" }
      ]);
    });
  });

  describe("customize method", () => {
    beforeEach(() => {
      fetchMock.postOnce(url, `{apiVersion: v1, kind: Pod}`, {
        sendAsJson: false
      });
    });

    test("should set headers to fetch", async () => {
      const result = loadUrl(url, {
        method: "POST"
      });

      await expect(result()).resolves.toEqual([
        { apiVersion: "v1", kind: "Pod" }
      ]);
    });
  });
});
