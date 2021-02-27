import _resolve from "resolve";

/**
 * Resolves path to the specified module.
 * See [resolve](https://www.npmjs.com/package/resolve) for more info.
 */
export function resolve(
  id: string,
  opts: _resolve.AsyncOpts = {}
): Promise<string | undefined> {
  return new Promise<string | undefined>((resolve, reject) => {
    _resolve(id, opts, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}
