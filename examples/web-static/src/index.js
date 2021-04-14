/* eslint-env browser */
import env, {
  createAsyncLoaderReducers
} from "https://cdn.skypack.dev/@kosko/env";
import {
  resolve,
  print,
  PrintFormat
} from "https://cdn.skypack.dev/@kosko/generate";

env.setReducers((reducers) => [
  ...reducers,
  ...createAsyncLoaderReducers({
    global: () =>
      import("./environments/dev/index.js").then((mod) => mod.default),
    component: (name) =>
      import(`./environments/dev/${name}.js`).then((mod) => mod.default)
  })
]);

(async () => {
  const manifests = await resolve(
    import("./components/nginx.js").then((mod) => mod.default)
  );

  console.log(manifests);

  const element = document.createElement("pre");
  document.body.appendChild(element);

  print(
    { manifests },
    {
      format: PrintFormat.YAML,
      writer: {
        write: (data) => {
          element.innerText += data;
        }
      }
    }
  );
})();
