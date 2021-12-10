#!/bin/bash

set -euo pipefail

pnpm changeset version
pnpm install --lockfile-only
