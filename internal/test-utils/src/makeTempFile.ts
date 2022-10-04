import tmp from "tmp-promise";
import tempDir from "temp-dir";
import type { FileOptions } from "tmp";

export type TempFile = tmp.FileResult;

export function makeTempFile(options?: FileOptions): Promise<TempFile> {
  return tmp.file({ tmpdir: tempDir, ...options });
}
