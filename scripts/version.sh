#!/bin/bash

set -euo pipefail

pnpx changeset version
rm -rf examples/*/CHANGELOG.md
git add -A
git commit -m 'chore: update versions'
