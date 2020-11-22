#!/bin/bash

set -euo pipefail

npm run build
npx lerna run --scope @kosko/website build
rm -rf website/build/api
npm run typedoc
