#!/bin/bash

set -euo pipefail

pnpm run clean
pnpm run build
pnpm changeset publish
git push --follow-tags
