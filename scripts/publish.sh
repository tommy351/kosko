#!/bin/bash

set -euo pipefail

pnpm run clean
pnpm run build
pnpx changeset version
pnpx changeset publish
