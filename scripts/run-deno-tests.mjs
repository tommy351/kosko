// @ts-check

/* eslint-disable node/no-unpublished-import */
import execa from "execa";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { runServer } from "verdaccio";
import globby from "globby";
import { readFile, rm, writeFile } from "node:fs/promises";

const ROOT_DIR = join(fileURLToPath(import.meta.url), "../..");
const TMP_DIR = join(ROOT_DIR, "tmp");
const VERDACCIO_PORT = 4873;
const REGISTRY_URL = `http://localhost:${VERDACCIO_PORT}/`;

const server = await startVerdaccio();

/**
 * @param {string} storagePath
 */
async function removePackagesFromVerdaccio(storagePath) {
  const paths = await globby("packages/*/package.json");

  for (const path of paths) {
    const manifest = JSON.parse(await readFile(path, "utf-8"));

    await rm(join(storagePath, manifest.name), {
      recursive: true,
      force: true
    });
  }
}

/**
 * @param {string} storagePath
 */
async function resetVerdaccioDb(storagePath) {
  const path = join(storagePath, ".verdaccio-db.json");

  try {
    const db = JSON.parse(await readFile(path, "utf-8"));

    db.list = [];

    await writeFile(path, JSON.stringify(db));
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
}

async function startVerdaccio() {
  const storage = join(TMP_DIR, "verdaccio-storage");

  await removePackagesFromVerdaccio(storage);
  await resetVerdaccioDb(storage);

  const server = await runServer({
    self_path: ROOT_DIR,
    storage,
    uplinks: {
      npmjs: {
        url: "https://registry.npmjs.org/"
      }
    },
    packages: {
      "@kosko/*": {
        access: "$all",
        publish: "$all"
      },
      kosko: {
        access: "$all",
        publish: "$all"
      },
      "**": {
        access: "$all",
        publish: "$authenticated",
        proxy: "npmjs"
      }
    },
    logs: { type: "stdout", level: "error" }
  });

  server.listen(VERDACCIO_PORT);

  return server;
}

/**
 * @param {readonly string[]} args
 * @param {execa.Options} options
 */
function execNpm(args, options = {}) {
  return execa("npm", args, {
    ...options,
    env: {
      ...options.env,
      npm_config_registry: REGISTRY_URL,
      npm_config__auth: "foo"
    }
  });
}

async function publishPackages() {
  const paths = await globby("packages/*/out/*.tgz", {
    cwd: ROOT_DIR,
    absolute: true
  });

  console.log("Publishing packages to testing registry");

  await Promise.all(paths.map((path) => execNpm(["publish", path])));
}

async function reloadDenoDependencies() {
  console.log("Reloading Deno dependencies");

  await execa(
    "deno",
    ["cache", "--reload=npm:kosko,npm:@kosko/", "npm:kosko"],
    {
      env: {
        NPM_CONFIG_REGISTRY: REGISTRY_URL
      }
    }
  );
}

async function runIntegrationTests() {
  const result = await execa(
    "jest",
    [
      "--config",
      join(ROOT_DIR, "jest.integration-deno.config.ts"),
      ...process.argv.slice(2)
    ],
    {
      stdio: "inherit",
      reject: false,
      env: {
        NPM_CONFIG_REGISTRY: REGISTRY_URL
      }
    }
  );

  process.exitCode = result.exitCode;
}

try {
  await publishPackages();
  await reloadDenoDependencies();
  await runIntegrationTests();
} finally {
  server.close();
}
