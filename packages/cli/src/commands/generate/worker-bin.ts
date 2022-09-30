import getStdin from "get-stdin";
import { handler } from "./worker";

(async () => {
  const options = JSON.parse(await getStdin());

  await handler({
    ...options,
    // Ignore loaders to avoid infinite loop
    ignoreLoaders: true
  });
})().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
