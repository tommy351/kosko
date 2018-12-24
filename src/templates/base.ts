import { mkdirs, writeFile, exists } from "../utils/fs";
import { dirname, join } from "path";
import { nop } from "../utils/nop";

export interface File {
  path: string;
  content: string;
}

export interface Template<Data> {
  validate?(data: Data): void;
  generate(data: Data): Promise<File[]>;
}

export interface WriteFileOptions {
  afterWritten?: (path: string, file: File) => void;
  onConflict?: (path: string, file: File) => Promise<boolean>;
}

function handleConflict() {
  return true;
}

export async function writeFiles(
  path: string,
  files: File[],
  options: WriteFileOptions = {}
) {
  const afterWritten = options.afterWritten || nop;
  const onConflict = options.onConflict || handleConflict;

  for (const file of files) {
    const filePath = join(path, file.path);

    if (exists(filePath)) {
      const overwrite = await onConflict(filePath, file);
      if (!overwrite) continue;
    }

    await mkdirs(dirname(filePath));
    await writeFile(filePath, file.content);
    await afterWritten(filePath, file);
  }
}
