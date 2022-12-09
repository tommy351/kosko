import execa from "execa";
import { dirname, join } from "node:path";
import { installPackage } from "@kosko/test-utils";
import { createServer, Server } from "node:http";
import { AddressInfo } from "node:net";

const testDir = dirname(__dirname);
let server: Server;

function execute(env?: Record<string, string>) {
  const address = server.address() as AddressInfo;

  return execa.node(join(testDir, "index.mjs"), {
    cwd: testDir,
    env: {
      SERVER_ADDRESS: `localhost:${address.port}`,
      ...env
    }
  });
}

beforeAll(async () => {
  await installPackage(testDir, "yaml");
  server = createServer((req, res) => {
    res.writeHead(200);
    res.end(`---
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
`);
  }).listen(0);
});

afterAll(() => {
  server.close();
});

describe("when fetch is polyfilled", () => {
  test("should be able to fetch", async () => {
    const result = await execute({ NODE_OPTIONS: "-r cross-fetch/polyfill" });

    expect(result.stdout).toMatchSnapshot();
  });
});

describe("when fetch is not polyfilled", () => {
  test("should be able to fetch", async () => {
    const result = await execute();

    expect(result.stdout).toMatchSnapshot();
  });
});
