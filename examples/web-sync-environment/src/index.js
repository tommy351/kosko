/* eslint-env browser */
import { resolve, print, PrintFormat } from "@kosko/generate";

(async () => {
  const manifests = await resolve(
    import("./components/nginx").then((mod) => mod.default)
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
