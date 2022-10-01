import BufferList from "bl";
import yaml from "js-yaml";
import { Pod } from "kubernetes-models/v1/Pod";
import { Manifest, Result } from "../../base";
import { print, printAsync, PrintFormat, PrintOptions } from "../index";

const SINGLE_DATA = [
  new Pod({
    metadata: { name: "foo" },
    spec: {
      containers: [{ name: "nginx", image: "nginx:foo" }]
    }
  })
];

const MULTI_DATA = [
  new Pod({
    metadata: { name: "foo" },
    spec: {
      containers: [{ name: "nginx", image: "nginx:foo" }]
    }
  }),
  new Pod({
    metadata: { name: "bar" },
    spec: {
      containers: [{ name: "nginx", image: "nginx:bar" }]
    }
  }),
  new Pod({
    metadata: { name: "baz" },
    spec: {
      containers: [{ name: "nginx", image: "nginx:baz" }]
    }
  })
];

describe("print", () => {
  let data: unknown[];
  let options: Omit<PrintOptions, "writer">;
  let bl: BufferList;

  beforeEach(() => {
    const result: Result = {
      manifests: data.map((x) => ({ data: x, index: [0], path: "" }))
    };

    bl = new BufferList();
    print(result, {
      ...options,
      writer: bl
    });
  });

  describe("when format = YAML", () => {
    beforeAll(() => {
      options = { format: PrintFormat.YAML };
    });

    describe("with no manifests", () => {
      beforeAll(() => {
        data = [];
      });

      test("should write nothing", () => {
        expect(bl.toString()).toEqual("");
      });
    });

    describe("and only one manifest", () => {
      beforeAll(() => {
        data = SINGLE_DATA;
      });

      test("should write YAML", () => {
        expect(yaml.load(bl.toString())).toEqual(data[0]);
      });

      test("should match snapshot", () => {
        expect(bl.toString()).toMatchSnapshot();
      });
    });

    describe("and multiple manifests", () => {
      beforeAll(() => {
        data = MULTI_DATA;
      });

      test("should write YAML with delimiters", () => {
        expect(yaml.loadAll(bl.toString())).toEqual(data);
      });

      test("should match snapshot", () => {
        expect(bl.toString()).toMatchSnapshot();
      });
    });
  });

  describe("when format = JSON", () => {
    beforeAll(() => {
      options = { format: PrintFormat.JSON };
    });

    describe("with no manifests", () => {
      beforeAll(() => {
        data = [];
      });

      test("should write nothing", () => {
        expect(bl.toString()).toEqual("");
      });
    });

    describe("and only one manifest", () => {
      beforeAll(() => {
        data = SINGLE_DATA;
      });

      test("should write JSON", () => {
        expect(JSON.parse(bl.toString())).toEqual(data[0]);
      });

      test("should match snapshot", () => {
        expect(bl.toString()).toMatchSnapshot();
      });
    });

    describe("and multiple manifests", () => {
      beforeAll(() => {
        data = MULTI_DATA;
      });

      test("should write JSON wrapped with List", () => {
        expect(JSON.parse(bl.toString())).toEqual({
          apiVersion: "v1",
          kind: "List",
          items: data
        });
      });

      test("should match snapshot", () => {
        expect(bl.toString()).toMatchSnapshot();
      });
    });
  });
});

describe("printAsync", () => {
  let data: unknown[];
  let options: Omit<PrintOptions, "writer">;
  let bl: BufferList;

  beforeEach(async () => {
    const iterable: AsyncIterable<Manifest> = {
      async *[Symbol.asyncIterator]() {
        for (const item of data) {
          yield { data: item, index: [0], path: "" };
        }
      }
    };

    bl = new BufferList();
    await printAsync(iterable, {
      ...options,
      writer: bl
    });
  });

  describe("when format = YAML", () => {
    beforeAll(() => {
      options = { format: PrintFormat.YAML };
    });

    describe("with no manifests", () => {
      beforeAll(() => {
        data = [];
      });

      test("should write nothing", () => {
        expect(bl.toString()).toEqual("");
      });
    });

    describe("and only one manifest", () => {
      beforeAll(() => {
        data = SINGLE_DATA;
      });

      test("should write YAML", () => {
        expect(yaml.load(bl.toString())).toEqual(data[0]);
      });

      test("should match snapshot", () => {
        expect(bl.toString()).toMatchSnapshot();
      });
    });

    describe("and multiple manifests", () => {
      beforeAll(() => {
        data = MULTI_DATA;
      });

      test("should write YAML with delimiters", () => {
        expect(yaml.loadAll(bl.toString())).toEqual(data);
      });

      test("should match snapshot", () => {
        expect(bl.toString()).toMatchSnapshot();
      });
    });
  });

  describe("when format = JSON", () => {
    beforeAll(() => {
      options = { format: PrintFormat.JSON };
    });

    describe("with no manifests", () => {
      beforeAll(() => {
        data = [];
      });

      test("should write nothing", () => {
        expect(bl.toString()).toEqual("");
      });
    });

    describe("and only one manifest", () => {
      beforeAll(() => {
        data = SINGLE_DATA;
      });

      test("should write JSON", () => {
        expect(JSON.parse(bl.toString())).toEqual(data[0]);
      });

      test("should match snapshot", () => {
        expect(bl.toString()).toMatchSnapshot();
      });
    });

    describe("and multiple manifests", () => {
      beforeAll(() => {
        data = MULTI_DATA;
      });

      test("should write JSON wrapped with List", () => {
        expect(JSON.parse(bl.toString())).toEqual({
          apiVersion: "v1",
          kind: "List",
          items: data
        });
      });

      test("should match snapshot", () => {
        expect(bl.toString()).toMatchSnapshot();
      });
    });
  });
});
