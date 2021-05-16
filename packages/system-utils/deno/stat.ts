import { handleError } from "./utils.ts";
import { Stats } from "../deno_dist/types.ts";

export async function stat(path: string): Promise<Stats> {
  try {
    const info = await Deno.stat(path);

    return {
      isFile: info.isFile,
      isDirectory: info.isDirectory,
      isSymbolicLink: info.isSymlink,
      size: info.size
    };
  } catch (err) {
    throw handleError(err);
  }
}
