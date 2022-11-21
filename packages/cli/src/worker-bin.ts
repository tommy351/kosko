import getStdin from "get-stdin";
import { handleError } from "./cli/error";
import { setupLogger } from "./cli/logger";
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
