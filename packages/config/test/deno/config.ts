import { loadConfig, searchConfig, ValidationError } from "../../mod.ts";
import {
  assertEquals,
  assertThrowsAsync
} from "https://deno.land/std@0.96.0/testing/asserts.ts";
import * as path from "https://deno.land/std@0.96.0/path/mod.ts";

const fixturePath = path.join(
  path.fromFileUrl(import.meta.url),
  "../../../__fixtures__"
);

Deno.test("loadConfig - when file exists", async () => {
  const config = await loadConfig(path.join(fixturePath, "toml", "kosko.toml"));
  assertEquals(config, {
    require: ["a"],
    components: ["b", "c"],
    extensions: ["js", "json"],
    baseEnvironment: "m",
    environments: {
      dev: { require: ["d", "e"], components: ["f", "g"] },
      prod: { require: ["h"], components: ["i", "j"] }
    },
    paths: { environment: { global: "k", component: "l" } }
  });
});

Deno.test("loadConfig - when file does not exist", async () => {
  await assertThrowsAsync(() => loadConfig(path.join(fixturePath, "nowhere")));
});

Deno.test("loadConfig - when config is invalid", async () => {
  await assertThrowsAsync(
    () => loadConfig(path.join(fixturePath, "invalid", "kosko.toml")),
    ValidationError
  );
});

Deno.test("searchConfig - when config is at kosko.toml", async () => {
  const config = await searchConfig(path.join(fixturePath, "toml"));
  assertEquals(config, {
    require: ["a"],
    components: ["b", "c"],
    extensions: ["js", "json"],
    baseEnvironment: "m",
    environments: {
      dev: { require: ["d", "e"], components: ["f", "g"] },
      prod: { require: ["h"], components: ["i", "j"] }
    },
    paths: { environment: { global: "k", component: "l" } }
  });
});

Deno.test("searchConfig - when config not found", async () => {
  const config = await searchConfig(path.join(fixturePath));
  assertEquals(config, {});
});

Deno.test("searchConfig - when config is invalid", async () => {
  await assertThrowsAsync(
    () => searchConfig(path.join(fixturePath, "invalid")),
    ValidationError
  );
});
