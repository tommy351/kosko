# jest-serializer-path

[![npm version](https://badge.fury.io/js/jest-serializer-path.svg)](https://badge.fury.io/js/jest-serializer-path)
[![Linux Build Status](https://img.shields.io/circleci/project/github/tribou/jest-serializer-path/master.svg?label=linux%20build)](https://circleci.com/gh/tribou/jest-serializer-path/tree/master)
[![Windows Build Status](https://img.shields.io/appveyor/ci/tribou/jest-serializer-path/master.svg?label=windows%20build)](https://ci.appveyor.com/project/tribou/jest-serializer-path/branch/master)
[![Coverage Status](https://coveralls.io/repos/github/tribou/jest-serializer-path/badge.svg?branch=master)](https://coveralls.io/github/tribou/jest-serializer-path?branch=master)
[![Project Status: Active - The project has reached a stable, usable state and is being actively developed.](http://www.repostatus.org/badges/latest/active.svg)](http://www.repostatus.org/#active)
[![bitHound Code](https://www.bithound.io/github/tribou/jest-serializer-path/badges/code.svg)](https://www.bithound.io/github/tribou/jest-serializer-path)

Remove absolute paths and normalize paths across all platforms in your Jest snapshots.

#### Quick Start

```bash
npm install --save-dev jest-serializer-path
```

Add this to your `package.json` Jest config:

```
"jest": {
  "snapshotSerializers": [
    "jest-serializer-path"
  ]
}
```

Or include only in individual tests:

```js
const serializer = require('jest-serializer-path')

expect.addSnapshotSerializer(serializer)
```

All absolute paths will now be converted and saved in snapshots like so:

`/path/to/my-proj/lib` => `<PROJECT_ROOT>/lib`

``/path/to/os-temp/nested/temp`` => ``<TEMP_DIR>/nested/temp``

``/path/to/user-home/nested/home`` => ``<HOME_DIR>/nested/home``

#### Caveats

* All single backslashes (`\`) will be replaced by a forward slash (`/`).
* Any string that looks like a Windows drive letter (`C:\`) will be replaced by a forward slash (`/`).

#### Build

This project bundles the yarn executable and the npm/yarn dependencies offline
in the `.npm-packages-offline-cache` directory for faster dependency installs
and better dev/prod parity across including preventing failure if yarn/npm is
offline.

```sh
# Install
npm run yarn

# Run tests
npm run test
```
