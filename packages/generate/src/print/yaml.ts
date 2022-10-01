import yaml from "js-yaml";
import { Result, Manifest } from "../base";
import { Printer } from "./types";

const LIST_SEP = "---\n";

function stringifyYAML(data: unknown): string {
  return yaml.dump(data, { noRefs: true });
}

export default class YAMLPrinter extends Printer {
  printResult(result: Result): void {
    if (result.manifests.length === 1) {
      this.writer.write(stringifyYAML(result.manifests[0].data));
      return;
    }

    for (const manifest of result.manifests) {
      this.writer.write(LIST_SEP + stringifyYAML(manifest.data));
    }
  }

  async printAsync(manifests: AsyncIterable<Manifest>): Promise<void> {
    for await (const manifest of manifests) {
      this.writer.write(LIST_SEP + stringifyYAML(manifest.data));
    }
  }
}
