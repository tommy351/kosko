#!/bin/bash

set -euo pipefail

npm run build
pnpm run build --filter @kosko/website
