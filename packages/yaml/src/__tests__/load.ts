import "cross-fetch/polyfill";
import { loadFile, LoadOptions, loadString, loadUrl } from "../load";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import fetch from "node-fetch";
import type { FetchMockStatic } from "fetch-mock";
import { Pod } from "kubernetes-models/v1/Pod";
import { TempDir, makeTempDir } from "@kosko/test-utils";
import { isRecord } from "@kosko/common-utils";

// eslint-disable-next-line @typescript-eslint/no-var-requires
jest.mock("node-fetch", () => require("fetch-mock").sandbox());

const fetchMock = fetch as unknown as FetchMockStatic;

afterEach(() => {
  fetchMock.reset();
});

function testLoad(options: {
  setup: (content: string) => Promise<void>;
  load: (options: LoadOptions) => () => Promise<unknown[]>;
}) {
  let content: string;
  let loadOptions: LoadOptions;
  let result: ReturnType<typeof options["load"]>;

  beforeEach(async () => {
    await options.setup(content);
    result = options.load(loadOptions);
  });

  describe("given a valid Kubernetes object", () => {
    beforeAll(() => {
      content = `
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
`.trim();
      loadOptions = {};
    });

    test("should return an async function which returns an array of objects", async () => {
      await expect(result()).resolves.toEqual([
        new Pod({
          metadata: { name: "test-pod" }
        })
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
      loadOptions = {};
    });

    test("should filter nulls", async () => {
      await expect(result()).resolves.toEqual([
        new Pod({
          metadata: { name: "test-pod" }
        })
      ]);
    });
  });

  describe("given a non-object", () => {
    beforeAll(() => {
      content = `"foo"`;
      loadOptions = {};
    });

    test("should throw an error", async () => {
      await expect(result()).rejects.toThrow(
        `The value must be an object: "foo"`
      );
    });
  });

  describe("given an array", () => {
    beforeAll(() => {
      content = `[1]`;
      loadOptions = {};
    });

    test("should throw an error", async () => {
      await expect(result()).rejects.toThrow(
        `The value must be an object: [1]`
      );
    });
  });

  describe("given an object without apiVersion", () => {
    beforeAll(() => {
      content = `foo: bar`;
      loadOptions = {};
    });

    test("should throw an error", async () => {
      await expect(result()).rejects.toThrow(
        `apiVersion and kind are required: {"foo":"bar"}`
      );
    });
  });

  describe("given an object with empty apiVersion", () => {
    beforeAll(() => {
      content = `apiVersion: ""`;
      loadOptions = {};
    });

    test("should throw an error", async () => {
      await expect(result()).rejects.toThrow(
        `apiVersion and kind are required: {"apiVersion":""}`
      );
    });
  });

  describe("given an object without kind", () => {
    beforeAll(() => {
      content = `apiVersion: v1`;
      loadOptions = {};
    });

    test("should throw an error", async () => {
      await expect(result()).rejects.toThrow(
        `apiVersion and kind are required: {"apiVersion":"v1"}`
      );
    });
  });

  describe("given an object with empty kind", () => {
    beforeAll(() => {
      content = `{apiVersion: v1, kind: ""}`;
      loadOptions = {};
    });

    test("should throw an error", async () => {
      await expect(result()).rejects.toThrow(
        `apiVersion and kind are required: {"apiVersion":"v1","kind":""}`
      );
    });
  });

  describe("given a custom resource", () => {
    beforeAll(() => {
      content = `
apiVersion: example.local/v1
kind: Foo
metadata:
  name: bar
`.trim();
      loadOptions = {};
    });

    test("should return a plain object", async () => {
      await expect(result()).resolves.toEqual([
        {
          apiVersion: "example.local/v1",
          kind: "Foo",
          metadata: { name: "bar" }
        }
      ]);
    });
  });

  describe("given a transform function", () => {
    beforeAll(() => {
      content = `
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
`.trim();
      loadOptions = {
        transform(manifest) {
          if (isRecord(manifest.metadata)) {
            manifest.metadata.name = "abc";
          }

          return manifest;
        }
      };
    });

    test("should return the transformed object", async () => {
      await expect(result()).resolves.toEqual([
        new Pod({
          metadata: {
            name: "abc"
          }
        })
      ]);
    });
  });

  describe("given a transform function returning null", () => {
    beforeAll(() => {
      content = `
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
`.trim();
      loadOptions = {
        transform() {
          return null;
        }
      };
    });

    test("should remove value from array", async () => {
      await expect(result()).resolves.toEqual([]);
    });
  });
}

describe("loadString", () => {
  let content: string;

  testLoad({
    setup: async (input) => {
      content = input;
    },
    load: (options) => {
      return () => loadString(content, options);
    }
  });
});

describe("loadFile", () => {
  let tmpDir: TempDir;
  let path: string;

  beforeEach(async () => {
    tmpDir = await makeTempDir();
    path = join(tmpDir.path, "test.yaml");
  });

  afterEach(async () => {
    await tmpDir.cleanup();
  });

  testLoad({
    setup: (content) => writeFile(path, content),
    load: (options) => loadFile(path, options)
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
      load: (options) => loadUrl(url, options)
    });
  });

  describe("when server responds 404", () => {
    beforeEach(() => {
      fetchMock.getOnce(url, {
        status: 404
      });
    });

    test("should throw error", async () => {
      await expect(loadUrl(url)()).rejects.toThrow(
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
