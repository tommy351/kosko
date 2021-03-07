export * from "./index.base";

import { AsyncEnvironment } from "./environment/async";
export default new AsyncEnvironment(process.cwd());
export { AsyncEnvironment as Environment };
