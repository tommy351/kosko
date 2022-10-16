import getStdin from "get-stdin";
import { handleError } from "../../cli/error";
import { handler, WorkerOptions } from "./worker";

(async () => {
  const options = JSON.parse(await getStdin()) as WorkerOptions;

  await handler({
    ...options,
    // Ignore loaders to avoid infinite loop
    ignoreLoaders: true
  });
})().catch(handleError);
