#!/bin/bash

set -euo pipefail

npm run build
npx lerna run --scope @kosko/website build
npm run typedoc
