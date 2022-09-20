#!/bin/bash

set -euo pipefail

pnpm run build
pnpm run --filter @kosko/website build
