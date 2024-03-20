---
title: ban-image
---

Disallow images which match the specified patterns.

## Configuration

### `images`

Image patterns to ban. For example:

- Ban images from a repository: `docker.io/*`
- Ban images with latest tag: `*:latest`
- Mix of both: `docker.io/*:latest`
