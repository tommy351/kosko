import { createSyncEnvironment, createSyncLoaderReducers } from "@kosko/env";

const env = createSyncEnvironment();
const dev = require.context("./environments/dev");

env.setReducers((reducers) => [
  ...reducers,
  ...createSyncLoaderReducers({
    global: () => dev("./index"),
    component: (name) => dev(`./${name}`)
  })
]);

export default env;
