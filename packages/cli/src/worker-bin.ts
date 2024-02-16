import getStdin from "get-stdin";
import { handleError, setupLogger } from "@kosko/cli-utils";
import { handler, type WorkerOptions } from "./commands/generate/worker";

(async () => {
  const options: WorkerOptions = JSON.parse(await getStdin());

  setupLogger(options.args);

  await handler({
    ...options,
    // Ignore loaders to avoid infinite loop
    ignoreLoaders: true
  });
})().catch(handleError);
