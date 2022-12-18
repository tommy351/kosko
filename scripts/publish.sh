#!/bin/bash

set -euo pipefail

pnpm run clean
DENO_BUILD_PROD=1 pnpm run build
pnpm changeset publish
git push --follow-tags
