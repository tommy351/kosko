"use strict";

process.stdout.write(`---
apiVersion: v1
kind: Pod
metadata:
  name: header
`);

process.stdin.pipe(process.stdout);
