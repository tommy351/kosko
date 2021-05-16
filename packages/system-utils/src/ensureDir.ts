import makeDir from "make-dir";
import { handleError } from "./utils";

export async function ensureDir(path: string): Promise<void> {
  try {
    await makeDir(path);
  } catch (err) {
    throw handleError(err);
  }
}
