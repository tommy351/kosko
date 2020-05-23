#!/bin/bash

set -euo pipefail

npm run clean
npm run build
npx lerna publish
