#!/bin/bash

set -eEuo pipefail

cat <<EOF
---
apiVersion: v1
kind: Pod
metadata:
  name: header
  annotations:
    args: "$@"
EOF

cat <&0
