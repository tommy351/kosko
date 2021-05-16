import tmp from "tmp-promise";

export async function makeTempFile(): Promise<string> {
  const file = await tmp.file();
  return file.path;
}
