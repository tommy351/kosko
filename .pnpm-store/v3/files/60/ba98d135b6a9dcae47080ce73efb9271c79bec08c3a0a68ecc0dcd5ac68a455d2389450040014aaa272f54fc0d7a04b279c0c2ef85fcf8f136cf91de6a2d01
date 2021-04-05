'use strict'
const fs = require('fs')
const path = require('path')
const promisify = require('util').promisify
const rimraf = promisify(require('rimraf'))
const rimrafSync = require('rimraf').sync

module.exports = async function renameOverwrite (oldPath, newPath) {
  try {
    await fs.promises.rename(oldPath, newPath)
  } catch (err) {
    switch (err.code) {
      case 'ENOTEMPTY':
      case 'EEXIST':
        await rimraf(newPath)
        await fs.promises.rename(oldPath, newPath)
        break
      // weird Windows stuff
      case 'EPERM':
        await new Promise(resolve => setTimeout(resolve, 200))
        await rimraf(newPath)
        await fs.promises.rename(oldPath, newPath)
        break
      case 'ENOENT':
        await fs.promises.mkdir(path.dirname(newPath), { recursive: true })
        await fs.promises.rename(oldPath, newPath)
        break
      default:
        throw err
    }
  }
}

module.exports.sync = function renameOverwriteSync (oldPath, newPath) {
  try {
    fs.renameSync(oldPath, newPath)
  } catch (err) {
    switch (err.code) {
      case 'ENOTEMPTY':
      case 'EEXIST':
      case 'EPERM': // weird Windows stuff
        rimrafSync(newPath)
        fs.renameSync(oldPath, newPath)
        return
      case 'ENOENT':
        fs.mkdirSync(path.dirname(newPath), { recursive: true })
        renameOverwriteSync(oldPath, newPath)
        return
      default:
        throw err
    }
  }
}
