import { createSyncEnvironment, createSyncLoaderReducers } from "@kosko/env";

const env = createSyncEnvironment();
const dev = require.context("./environments/dev");

env.setReducers((reducers) => [
  ...reducers,
  ...createSyncLoaderReducers({
    global: () => dev("./index").default,
    component: (name) => dev(`./${name}`).default
  })
]);

export default env;
