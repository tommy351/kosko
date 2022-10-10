import tmp from "tmp-promise";
import tempDir from "temp-dir";
import type { DirOptions } from "tmp";

export type TempDir = tmp.DirectoryResult;

export function makeTempDir(options?: DirOptions): Promise<TempDir> {
  return tmp.dir({ tmpdir: tempDir, unsafeCleanup: true, ...options });
}
