#!/bin/bash

set -euo pipefail

npm run build
npm run typedoc
npx lerna run --scope @kosko/website build
