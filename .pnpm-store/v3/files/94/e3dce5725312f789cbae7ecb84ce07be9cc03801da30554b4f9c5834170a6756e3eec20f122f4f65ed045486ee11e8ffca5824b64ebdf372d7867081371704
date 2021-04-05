'use strict'

/* eslint-disable no-param-reassign */

const slash = require('slash')
const cloneDeep = require('lodash.clonedeep')
const isError = require('lodash.iserror')
const os = require('os')
const path = require('path')
const fs = require('fs')

module.exports = {
  print (val, serialize) {

    let normalizedValue = val

    if (isError(normalizedValue)) {

      const message = normalizePaths(normalizedValue.message)
      const error = new Error(message)

      // Clone hidden props
      const ownProps = Object.getOwnPropertyNames(error)
      for (const index in ownProps) {

        // istanbul ignore else hasOwnProperty will never be tested
        if (Object.prototype.hasOwnProperty.call(ownProps, index)) {

          const key = ownProps[index]

          error[key] = normalizePaths(normalizedValue[key])

        }

      }

      // Clone normal props
      for (const index in normalizedValue) {

        // istanbul ignore else hasOwnProperty will never be tested
        if (Object.prototype.hasOwnProperty.call(normalizedValue, index)) {

          error[index] = normalizePaths(normalizedValue[index])

        }

      }

      normalizedValue = error

    }
    else if (typeof normalizedValue === 'object') {

      normalizedValue = cloneDeep(normalizedValue)

      Object.keys(normalizedValue).forEach(key => {

        normalizedValue[key] = normalizePaths(normalizedValue[key])

      })

    }
    else {

      normalizedValue = normalizePaths(normalizedValue)

    }

    return serialize(normalizedValue)

  },
  test (val) {

    let has = false

    if (val && typeof val === 'object') {

      // val.message is non-enumerable in an error
      if (val.message && shouldUpdate(val.message)) {

        has = true

      }

      Object.keys(val).forEach(key => {

        if (shouldUpdate(val[key])) {

          has = true

        }

      })

    }
    else if (shouldUpdate(val)) {

      has = true

    }

    return has

  },
  normalizePaths,
  getRealPath,
}

/**
 * Normalize paths across platforms.
 * Filters must be ran on all platforms to guard against false positives
 */
function normalizePaths (value) {

  if (typeof value !== 'string') {

    return value

  }

  const cwd = process.cwd()
  const cwdReal = getRealPath(cwd)
  const tempDir = os.tmpdir()
  const tempDirReal = getRealPath(tempDir)
  const homeDir = os.homedir()
  const homeDirReal = getRealPath(homeDir)

  const homeRelativeToTemp = path.relative(tempDir, homeDir)
  const homeRelativeToTempReal = path.relative(tempDirReal, homeDir)
  const homeRealRelativeToTempReal = path.relative(tempDirReal, homeDirReal)
  const homeRealRelativeToTemp = path.relative(tempDir, homeDirReal)

  const runner = [
    // Replace process.cwd with <PROJECT_ROOT>
    val => val.split(cwdReal).join('<PROJECT_ROOT>'),
    val => val.split(cwd).join('<PROJECT_ROOT>'),

    // Replace home directory with <TEMP_DIR>
    val => val.split(tempDirReal).join('<TEMP_DIR>'),
    val => val.split(tempDir).join('<TEMP_DIR>'),

    // Replace home directory with <HOME_DIR>
    val => val.split(homeDirReal).join('<HOME_DIR>'),
    val => val.split(homeDir).join('<HOME_DIR>'),

    // handle HOME_DIR nested inside TEMP_DIR
    val => val.split(`<TEMP_DIR>${path.sep + homeRelativeToTemp}`).join('<HOME_DIR>'),
    val => val.split(`<TEMP_DIR>${path.sep + homeRelativeToTempReal}`).join('<HOME_DIR>'), // untested
    val => val.split(`<TEMP_DIR>${path.sep + homeRealRelativeToTempReal}`).join('<HOME_DIR>'),
    val => val.split(`<TEMP_DIR>${path.sep + homeRealRelativeToTemp}`).join('<HOME_DIR>'), // untested

    // Remove win32 drive letters, C:\ -> \
    val => val.replace(/[a-zA-Z]:\\/g, '\\'),

    // Convert win32 backslash's to forward slashes, \ -> /
    val => slash(val),
  ]

  let result = value
  runner.forEach(current => {

    result = current(result)

  })

  return result

}

function shouldUpdate (value) {

  if (typeof value !== 'string') {

    return false

  }

  // return true if value is different from normalized value
  return normalizePaths(value) !== value

}

function getRealPath (pathname) {

  try {

    const realPath = fs.realpathSync(pathname)

    return realPath

  }
  catch (error) {

    return pathname

  }

}
