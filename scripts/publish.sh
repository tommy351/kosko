#!/bin/bash

set -e

npm run clean
npm run build
lerna publish
