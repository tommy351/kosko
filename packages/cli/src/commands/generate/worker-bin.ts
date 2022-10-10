import getStdin from "get-stdin";
import { handleError } from "../../cli/error";
import { handler } from "./worker";

(async () => {
  const options = JSON.parse(await getStdin());

  await handler({
    ...options,
    // Ignore loaders to avoid infinite loop
    ignoreLoaders: true
  });
})().catch(handleError);
