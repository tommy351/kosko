import tmp from "tmp-promise";
import tempDir from "temp-dir";
import type { DirOptions, FileOptions } from "tmp";

export type TempDir = tmp.DirectoryResult;

export type TempFile = tmp.FileResult;

export function makeTempDir(options?: DirOptions): Promise<TempDir> {
  return tmp.dir({ tmpdir: tempDir, unsafeCleanup: true, ...options });
}

export function makeTempFile(options?: FileOptions): Promise<TempFile> {
  return tmp.file({ tmpdir: tempDir, ...options });
}
