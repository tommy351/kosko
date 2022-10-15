import { Extractor, ExtractorConfig } from "@microsoft/api-extractor";
import { rm } from "fs/promises";
import globby from "globby";
import { dirname, join } from "path";

const DEST_DIR = join(__dirname, "../tmp/api-models");

function extract(configPath: string) {
  console.log("Extracting:", dirname(configPath));

  const config = ExtractorConfig.loadFileAndPrepare(configPath);
  return Extractor.invoke(config, {});
}

(async () => {
  const paths = await globby("packages/*/api-extractor.json", {
    cwd: join(__dirname, "../.."),
    absolute: true
  });

  await rm(DEST_DIR, { recursive: true, force: true });

  const results = paths.map(extract);

  if (results.some((result) => !result.succeeded)) {
    throw new Error("API extractor failed");
  }
})().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
