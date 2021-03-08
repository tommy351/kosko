#!/bin/bash

set -euo pipefail

pnpm run build
pnpm run build --filter @kosko/website
