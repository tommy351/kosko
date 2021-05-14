import { loadString, loadFile, loadUrl, LoadOptions } from "../../mod.ts";
import { Pod } from "kubernetes-models/v1/Pod";
import { path, expect } from "@test/deps.ts";
import fetchMock from "https://jspm.dev/npm:fetch-mock@9.11.0";

function testLoad(options: {
  setup: (content: string) => Promise<void>;
  load: (options: LoadOptions) => () => Promise<readonly unknown[]>;
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
      await expect(result()).to.eventually.deep.equal([
        new Pod({
          metadata: { name: "test-pod" }
        })
      ]);
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
      await expect(result()).to.eventually.deep.equal([
        {
          apiVersion: "example.local/v1",
          kind: "Foo",
          metadata: { name: "bar" }
        }
      ]);
    });
  });
}

describe("@kosko/yaml loadString", () => {
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

describe("@kosko/yaml loadFile", () => {
  let tmpDir: string;
  let filePath: string;

  beforeEach(async () => {
    tmpDir = await Deno.makeTempDir();
    filePath = path.join(tmpDir, "test.yaml");
  });

  afterEach(async () => {
    await Deno.remove(tmpDir, { recursive: true });
  });

  testLoad({
    setup: (content) => Deno.writeTextFile(filePath, content),
    load: (options) => loadFile(filePath, options)
  });
});

describe("@kosko/yaml loadUrl", () => {
  const url = "http://example.local/test.yaml";

  afterEach(() => {
    fetchMock.reset();
  });

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
      await expect(loadUrl(url)()).to.be.rejectedWith(
        `Failed to fetch YAML file from: ${url}`
      );
    });
  });
});
